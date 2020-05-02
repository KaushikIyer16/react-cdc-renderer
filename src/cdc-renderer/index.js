import Reconciler from "react-reconciler";
import { isUnitlessProperty, logEvent } from "./util";

const shallowDiff = (oldProps, newProps) => {
  const uniqueProps = new Set([
    ...Object.keys(oldProps),
    ...Object.keys(newProps),
  ]);
  const changedProps = Array.from(uniqueProps).filter(
    (propName) => oldProps[propName] !== newProps[propName],
  );

  return changedProps;
};

// Method to check if attribute type is a event handler
const isEvent = (propName) => propName.startsWith("on") && window.hasOwnProperty(propName.toLowerCase());

const setStyle = (domElement, styles) => {
  Object.keys(styles).forEach((name) => {
    const rawValue = styles[name];
    const isEmpty = rawValue === null || typeof rawValue === "boolean" || rawValue === "";
    // Unset the style to its default values using an empty string if style value is empty
    if (isEmpty) {
      domElement.style[name] = "";
    } else {
      // If property has no units, set it as raw value, else add px by default unit
      const value = typeof rawValue === "number" && !isUnitlessProperty(name)
        ? `${rawValue}px` // TODO: Remove px hardcoding and support custom units
        : rawValue;
      domElement.style[name] = value;
    }
  });
};

const reconciler = Reconciler({
  supportsMutation: true,
  supportsHydration: false,
  supportsPersistence: false,

  createInstance: (
    type,
    props,
  ) => {
    const element = document.createElement(type);
    const logEventObject = {
      type,
      styles: {},
      className: "",
      props: {},
      children: [],
      listeners: {},
    };
    Object.keys(props)
      .filter((attr) => !["children"].includes(attr))
      .forEach((attr) => {
        if (attr === "style") {
          logEventObject.styles = props[attr];
          setStyle(element, props[attr]);
        } else if (isEvent(attr)) {
          const eventName = attr.toLowerCase().replace("on", "");
          logEventObject.listeners[eventName] = props[attr];
          element.addEventListener(eventName, props[attr]);
        } else if (attr === "className") {
          logEventObject.className = props[attr];
          element[attr] = props[attr];
        } else {
          logEventObject.props[attr] = props[attr];
          element[attr] = props[attr];
        }
      });
    logEvent("C", null, logEventObject);
    return element;
  },

  createTextInstance: (
    text,
  ) => document.createTextNode(text),

  appendChildToContainer: (container, child) => {
    container.appendChild(child);
  },

  appendChild: (parent, child) => {
    parent.appendChild(child);
  },

  appendInitialChild: (parent, child) => {
    parent.appendChild(child);
  },

  removeChildFromContainer: (container, child) => {
    container.removeChild(child);
  },

  removeChild: (parent, child) => {
    parent.removeChild(child);
  },

  insertInContainerBefore: (container, child, before) => {
    container.insertBefore(child, before);
  },

  insertBefore: (parent, child, before) => {
    parent.insertBefore(child, before);
  },

  prepareUpdate: (
    instance,
    type,
    oldProps,
    newProps,
    // Determine if update is required for nodes based on the diff
    // of the old and new props on the node
  ) => shallowDiff(oldProps, newProps),

  commitUpdate: (
    domElement,
    updatePayload,
    type,
    oldProps,
    newProps,
  ) => {
    // For each of the child nodes that require an update, update the props
    // on the domElement received
    updatePayload.forEach((propName) => {
      // If prop is a child element, update the base domElement and return
      if (propName === "children") {
        const propValue = newProps[propName];
        if (typeof propValue === "string" || typeof propValue === "number") {
          domElement.textContent = propValue;
        }
        return;
      }

      if (propName === "style") {
        // Get a diff between the new and the old styles
        const styleDiffs = shallowDiff(oldProps.style, newProps.style);
        // Accumulate the new styles to be applied to the element
        const finalStyles = styleDiffs.reduce((acc, styleName) => {
          // If new styles are empty for an existing style, it is marked to be unset
          if (!newProps.style[styleName]) {
            acc[styleName] = "";
          } else {
            acc[styleName] = newProps.style[styleName];
          }
          return acc;
        }, {});
        // Set the styles for the element
        setStyle(domElement, finalStyles);
      } else if (newProps[propName] || typeof newProps[propName] === "number") {
        // If prop is a event handler, remove the previous handler and set the new one
        if (isEvent(propName)) {
          const eventName = propName.toLowerCase().replace("on", "");
          domElement.removeEventListener(eventName, oldProps[propName]);
          domElement.addEventListener(eventName, newProps[propName]);
        } else {
          // For generic non-event and style props, set it as attribute
          domElement.setAttribute(propName, newProps[propName]);
        }
      } else {
        // Remove the attribute if no conditions for prop types are satisfied
        domElement.removeAttribute(propName);
      }
    });
  },

  commitMount: (domElement) => {
    domElement.focus();
  },

  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.nodeValue = newText;
  },

  getRootHostContext: () => {},

  getChildHostContext: () => {},

  shouldSetTextContent: () => false,

  prepareForCommit: () => {},

  resetAfterCommit: () => {},

  finalizeInitialChildren: (instance, types, newProps) => newProps.autofocus,
});

export default {
  render: (element, root, callback) => {
    const container = reconciler.createContainer(root, false, false);
    reconciler.updateContainer(element, container, null, callback);
  },
};

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

const isEvent = (propName) => propName.startsWith("on") && window.hasOwnProperty(propName.toLowerCase());

const setStyle = (domElement, styles) => {
  Object.keys(styles).forEach((name) => {
    const rawValue = styles[name];
    const isEmpty = rawValue === null || typeof rawValue === "boolean" || rawValue === "";

    // Unset the style to its default values using an empty string
    if (isEmpty) domElement.style[name] = "";
    else {
      const value = typeof rawValue === "number" && !isUnitlessProperty(name)
        ? `${rawValue}px`
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
    rootContainerInstance,
    hostContext,
  ) => {
    const element = document.createElement(type);
    const eventLogProps = ["create instance", element];
    Object.keys(props)
      .filter((attr) => !["children"].includes(attr))
      .forEach((attr) => {
        if (attr === "style") {
          eventLogProps.push(`attach style prop: ${props[attr]}`);
          setStyle(element, props[attr]);
        } else if (isEvent(attr)) {
          const eventName = attr.toLowerCase().replace("on", "");
          eventLogProps.push(`attach event handler ${attr.toLowerCase()} : ${props[attr]}`);
          element.addEventListener(eventName, props[attr]);
        } else {
          eventLogProps.push(`attach custom prop ${attr} : ${props[attr]}`);
          element[attr] = props[attr];
        }
      });
    logEvent(hostContext.reason, eventLogProps);
    return element;
  },

  createTextInstance: (
    text,
    rootContainerInstance,
    hostContext,
  ) => {
    const eventLogProps = ["create text instance", text];
    logEvent(hostContext.reason, eventLogProps);
    return document.createTextNode(text);
  },

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
    const eventLogProps = ["remove instance", child];
    logEvent("child-instrumentation", eventLogProps);
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
    rootContainerInstance,
    currentHostContext,
  ) => shallowDiff(oldProps, newProps),

  commitUpdate: (
    domElement,
    updatePayload,
    type,
    oldProps,
    newProps,
    finishedWork,
  ) => {
    updatePayload.forEach((propName) => {
      // children changes is done by the other methods like `commitTextUpdate`
      if (propName === "children") {
        const propValue = newProps[propName];
        if (typeof propValue === "string" || typeof propValue === "number") {
          domElement.textContent = propValue;
        }
        return;
      }

      if (propName === "style") {
        // Return a diff between the new and the old styles
        const styleDiffs = shallowDiff(oldProps.style, newProps.style);
        const finalStyles = styleDiffs.reduce((acc, styleName) => {
          // Style marked to be unset
          if (!newProps.style[styleName]) acc[styleName] = "";
          else acc[styleName] = newProps.style[styleName];

          return acc;
        }, {});

        setStyle(domElement, finalStyles);
      } else if (newProps[propName] || typeof newProps[propName] === "number") {
        if (isEvent(propName)) {
          const eventName = propName.toLowerCase().replace("on", "");
          domElement.removeEventListener(eventName, oldProps[propName]);
          domElement.addEventListener(eventName, newProps[propName]);
        } else {
          /* difference between setAttribute and the method used in createInstance */
          domElement.setAttribute(propName, newProps[propName]);
        }
      } else if (isEvent(propName)) {
        const eventName = propName.toLowerCase().replace("on", "");
        domElement.removeEventListener(eventName, oldProps[propName]);
      } else {
        domElement.removeAttribute(propName);
      }
    });
  },

  getRootHostContext: () => ({
    reason: "root-host-instrumentation",
  }),

  getChildHostContext: () => ({
    reason: "child-instrumentation",
  }),

  shouldSetTextContent: () => false,

  prepareForCommit: () => {},

  resetAfterCommit: () => {},

  finalizeInitialChildren: () => {},
});

export default {
  render: (element, root) => {
    const container = reconciler.createContainer(root, false, false);
    reconciler.updateContainer(element, container, null, null);
  },
};

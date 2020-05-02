import { v4 as uuid } from "uuid";

const sessionId = uuid();
const unitlessCSSProperties = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};

// Force property values to be boolean based on existance of value for unitless props
export const isUnitlessProperty = (style) => !!unitlessCSSProperties[style];

export const logEvent = (operation, previousState, nextState) => {
  const eventObject = {
    sessionId,
    cdcId: uuid(), // Unique ID for every event
    operation, // (Map to Create, Update and Delete operations)
    // Structure of before and after object:
    // {
    // type: "",
    // styles: {}, // (For styles that might not be a part of CSS class definitions)
    // classNames: "", // (Class names to recreate UI using CSS style definitions)
    // props: {},
    // children: [], // (Only the list of hashes)
    // listeners: {},
    // }
    before: previousState || null,
    after: nextState || null,
  };
  console.log(eventObject);
};

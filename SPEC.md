## CDC 

Change Data Capture and is a technique used to capture and replicate data between multiple data sources and their different states. We are using that concept in 
this project as a tool to help in software usage telemetry and instrumentation.

## Format of the change event capture

```
{
  cdcId: <Custom unique hash for event instance>
  before: {
    type: 'div|img|span|html-tag',
    styles:[], (For styles that might not be a part of CSS class definitions)
    classNames:[], (Class names to recreate UI using CSS style definitions)
    props:[],
    children:[], (Only the list of hashes)
    listeners: {},
  },
  after: {
    type: 'div|img|span|html-tag',
    styles:[],
    classNames:[],
    props:[],
    children:[],
    listeners: {},
  },
  operation: "C|U|D" (Map to Create, Update and Delete operations)
}
```

## Operations captured and state change

- creation of new element: before is null, after is the value of the host node.
- updation of element: before contains node value before the update, after contains updated node values.
- deletion of element: before contains node value, after is null.

## Milestones for beta release

- Extending the spec defined to react-native applications and other frameworks.
- Write factory methods for various host environments.
- Building message replayer for recreating the UI using event logs.
- Create event capture and storage server.
- Attaching network calls for event logging at remote location

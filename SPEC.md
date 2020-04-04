CDC stands for change data capture and is a technique used to replicate data between multiple data sources
but in this project we are looking it as a tool to help in software telemetry and instrumentation.

## the format of the message:

```
{
  cdcId: <hash that we custom generate>
  before: {
    type: 'div|img|span',
    styles:[], (as we wont have the css files if we want to replay the messages torecreate the UI)
    classNames:[],
    props:[],
    children:[], (only the list of hashes)
    listeners: {},
  },
  after: {
    type: 'div|img|span',
    styles:[],
    classNames:[],
    props:[],
    children:[],
    listeners: {},
  },
  operation: "c|u|d"
}
```

so the operations can be split into:

- creation of new element: before is null, after is the value of the host node,
- updation of element: before contains value before the change, same logic for after.
- deletion of element: before is the value of the node, after is null.

## key problems which has not been addressed/solved:

- we have to extend the spec to native applications.
- we have to write factory methods for various host environments.
- we have to build the message replayer.
- we need to push these events to a server in a continuous fashion
- figure out how to attach network calls associated with host change if possible.

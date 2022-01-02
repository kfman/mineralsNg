# MineralsNg

This project was generated
with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.2.

# Open issues

## Sample list widget

- Creating a sample list widget could be used in csv data import and as default
  list widget.

# Secrets

The Firebase secrets are located in **/src/app/firebaseConfig.json** and ignored
from git. As JSON content:

```json
{
  "apiKey": "...",
  "authDomain": "mineral-register.firebaseapp.com",
  "databaseURL": "https://mineral-register.firebaseio.com",
  "projectId": "mineral-register",
  "storageBucket": "mineral-register.appspot.com",
  "messagingSenderId": "...",
  "appId": "...",
  "measurementId": "..."
}
```

## page dimension

```typescript
var dd = {
  pageSize: 'A4',
  pageMargins: [0, 0, 0, 0],
  content: {
    canvas: [
      {type: 'rect', x: 0, y: 0, w: 595, h: 841},
    ]
  }
}
```

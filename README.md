# parse-to-firebase
JSON Users data conversion tool to convert from Parse to the structure that is able to import to Firebase.

### Note: The input file must be JSON.

Setup:
```
yarn install
```

Usage:
```
node ./convert-users --in=path/to/parse-users.json --out=path/to/output.json [--includeSocials]
```

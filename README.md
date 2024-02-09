# Role Permission Checks
Permission React Role is a comprehensive and lightweight solution for managing access control and user permissions in React applications. It offers a range of components, hooks, and helper methods that enable you to easily implement access checks and ensure that users have the appropriate permissions throughout your application.
# Installation
Use npm to install: 

```shell
npm install role-permission-checks
```
Use yarn to install:

```shell
yarn add role-permission-checks
```

# How to use

## `PermissionProvider`

To perform access checks in a specific part of your application, you can use PermissionProvider to wrap that section of the code. By doing so, you can take advantage of the Permission components, hooks, and helper methods that are designed to simplify access control and user permission management. When using PermissionProvider, be sure to pass the necessary props to enable access to these features throughout your application.

```javascript
import React from "react";
import { PermissionProvider } from "role-permission-checks";
const App = () => {
    return (
        <PermissionProvider>
            {/* App layers */}
        </PermissionProvider>;
    )
};
export default App;
```
### User Identification

To verify user roles or permissions, it's essential to set the logged-in user using the ```setUser``` function. We recommend calling this function within the promise of your login function. By doing so, you can ensure that the user's role and permissions are properly set and available throughout your application.

You can set the user by using the ```usePermission``` hook as follows:- 

```javascript

import { usePermission } from 'role-permission-checks';
const { setUser } = usePermission();
const Userlogin = async (event) => {
    const response = await Login(username, password);
    setUser({
        id: "dsf345vnb090",
        roles: ["root-user", "admin"],
        permissions: ["read", "update", "delete", "create"]
    })        
};
```

Or you can use the  ```PermissionContext``` as well as follows:-

```javascript
import React from "react";
import { PermissionContext } from "role-permission-checks";
const Authentication = () => {
    const UserLogin = (setUser) => {
        return async (event) => {
            const response = await Login(username, password);
            setUser({
                id: "dsf345vnb090",
                roles: ["root-user", "admin"],
                permissions: ["read", "update", "delete", "create"]
            })
        };
    };
    return (
        <PermissionContext.Consumer>
            {({ setUser }) => (
                <form onSubmit={Login(setUser)}>
                    ......
                    ......
                    ......
                </form>
            )}
        </PermissionContext.Consumer>; 
    )
};
export default Authentication;
```

## `AllowedAccess` 

To restrict access to specific components or UI layers based on user permissions, you can utilize the AllowedAccess wrapper component. This component allows you to easily control access to certain parts of your application by wrapping the components or UI layers that require authorization. Additionally, you can pass the user's roles and permissions as props to check and manage access within the AllowedAccess component.

```javascript
import React from "react";
import { AllowedAccess } from "role-permission-checks";
const ComponentName = () => {
    return (
        <AllowedAccess
            roles={["Role1", "Role2"]} 
            permissions="add-user" //optional - roles and paermission set on the component must be passed in order to access the child component
            renderAuthFailed={<p>No permission to view this module!</p>}
            isLoading={<Spinner/>}
        >
            <button type="button"> Delete </button>
        </AllowedAccess>
    )
};
export default ComponentName;
```

## `isAuthorized(roleNames, permissionNames)`

To limit access to specific components or UI layers based on user permissions, you can employ the AllowedAccess wrapper component. This component facilitates the restriction of certain parts of your application by encapsulating the components or UI layers that necessitate authorization. Furthermore, you can provide the user's roles and permissions as props to validate and regulate access within the AllowedAccess component.

```javascript
import React, {useState, useEffect} from "react";
import { usePermission } from "role-permission-checks";
const AppComponent = () => {
    const { isAuthorized, isLoading } = usePermission();
    useEffect(() => {
        const fetchData = async () => {
            // Roles and permissions can be provided accordingly 
            // Use an empty array or null as the first parameter to solely check permissions.
            if (await isAuthorized(["admin", "manager"], "user-delete")) {
                //next Process
            }
        };
        fetchData();
    },[]);
    return (
        <>  
            {isLoading && <span>Loading...</span>}
            {dataFetched &&
                <ProtectedComponent />
            }
        </ProtectedComponent>;
    )
};

export default AppComponent;
```

# License
The MIT License (MIT)


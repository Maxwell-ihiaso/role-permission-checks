import * as React from 'react';
import { useEffect, useState, PropsWithChildren } from 'react'

export interface IUserPayload {
  id: any;
  roles: any[];
  permissions: any[];
}

const LOCAL_STORAGE_KEY_USER = "__permissionUser";

export interface HasAccessProps {
  roles?: any[];
  permissions?: any[];
  isLoading?: React.ReactElement;
  renderAuthFailed?: React.ReactElement;
  children?: any;
}

const AllowedAccess = ({
  roles,
  permissions,
  renderAuthFailed,
  isLoading,
  children
}: PropsWithChildren<HasAccessProps>) => {
  const [allowedAccess, setAllowedAccess] = useState(false)
  const [checking, setChecking] = useState(true)
  const storedUserRef = React.useRef<IUserPayload | null>(null)
  const retryGetStoredUserRef = React.useRef<NodeJS.Timer| null>(null)
  const retryGetStoredUserTimeoutRef = React.useRef<NodeJS.Timeout| null>(null)

  useEffect(() => {
    storedUserRef.current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER));

    if(!storedUserRef.current) {
      console.log('No user provided for permission! You should set user to perfom the access check');
      return;
    } 

    setChecking(true)

    // check the roles here
    if (roles && storedUserRef.current?.roles && storedUserRef.current?.roles.length > 0) {
      const intersection = storedUserRef.current?.roles.filter((role: any) => roles.includes(role));
      setAllowedAccess(intersection.length > 0)

    }

    // check the permission here
    if (permissions && storedUserRef.current?.permissions && storedUserRef.current?.permissions.length > 0) {
      const intersection = storedUserRef.current?.permissions.filter((permission: any) => permissions.includes(permission));
      setAllowedAccess(intersection.length > 0)
    }

    setChecking(false)

  }, [roles, permissions, storedUserRef.current])


  /**
   * Attempt to refetch the user object within 10 seconds (every 100 milliseconds), if the user is not set initially
   */
  useEffect(() => {
    retryGetStoredUserRef.current = setInterval(() => {
      storedUserRef.current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER));

        if (storedUserRef.current) {
          retryGetStoredUserRef.current && clearInterval(retryGetStoredUserRef.current)
          retryGetStoredUserTimeoutRef.current && clearTimeout(retryGetStoredUserTimeoutRef.current)
        }
    }, 100)
  
    retryGetStoredUserTimeoutRef.current = setTimeout(() => {
          retryGetStoredUserRef.current && clearInterval(retryGetStoredUserRef.current)
          setChecking(false)
    }, 10000)

    return () => {
      clearInterval(retryGetStoredUserRef.current)
      clearTimeout(retryGetStoredUserTimeoutRef.current)
    }

  },[])

  if (!allowedAccess && checking) {
    return isLoading
  }
  
  if (allowedAccess) {
    return (
      // Render the children prop directly
      children
    )
  }

  if (!allowedAccess && !checking) {
    return renderAuthFailed
  }

  return null
}

export default AllowedAccess;

"use client";

import { UserModal } from "@/components/mod/create-user-modal";
import { useState, useEffect } from "react";



export const ModalProvider = () =>{
    const [isMounted, setIsMounted] = useState(false)

    useEffect(()=>{
        setIsMounted(true);
    }, [])

    if(!isMounted){
        return null
    }

    return(
        <UserModal />
    )
}
"use client";

import React from 'react';
import { Gamepad2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { redirect, useParams } from 'next/navigation';

interface NameProps {
  className?: string;
}

const NameProps: React.FC<NameProps> = ({ className }) => {
  const params = useParams();

  return (
    <Button 
        variant="outline"
        size="sm"
        role="combobox"
        aria-label="Select a Store"
        className={cn("w-[200px] justify-between cursor-pointer", className)}
        onClick={() => redirect(`/${params.userId}`)}
    >
        <Gamepad2 className="mr-2 h-4 w-4"/>
        Globetrotter
    </Button>
  );
}

export default NameProps;

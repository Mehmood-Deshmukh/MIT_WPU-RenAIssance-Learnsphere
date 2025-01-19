import React from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";

function ReferenceMaterialCard({ material }) {
  const header = (
    <div className="relative">
      <div className="absolute top-0 right-0 m-2">
        <Badge value={material.type} severity="info" />
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-content-between align-items-center">
      <span className="text-sm text-500">{material.size}</span>
      <Button
        icon="pi pi-download"
        className="p-button-rounded p-button-text"
        tooltip="Download material"
      />
    </div>
  );

  return (
    <Card header={header} footer={footer} className="w-full md:w-30rem m-2">
      <div className="p-2">
        <h3 className="text-xl font-semibold mb-2">{material.title}</h3>
        <p className="text-color-secondary">{material.description}</p>
      </div>
    </Card>
  );
}

export default ReferenceMaterialCard;

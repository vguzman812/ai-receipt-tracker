"use client";

import {
  SchematicEmbed as SchematicEmbedComponent,
  EmbedProvider,
} from "@schematichq/schematic-components";

// Generic wrapper component for the SchematicEmbed componen: https://docs.schematichq.com/components/set-up
// For use with components/schematic/SchematicComponent.tsx

function SchematicEmbed({
  accessToken,
  componentId,
}: {
  accessToken: string;
  componentId: string;
}) {
  return (
    <EmbedProvider>
      <SchematicEmbedComponent accessToken={accessToken} id={componentId} />
    </EmbedProvider>
  );
}
export default SchematicEmbed;

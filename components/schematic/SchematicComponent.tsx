import { getTemporaryAccessToken } from "@/actions/getTemporaryAccessToken";
import SchematicEmbed from "./SchematicEmbed";

/*
server component fetches the accessToken on the server
Then renders client component with passed props.
Adapted from https://docs.schematichq.com/components/set-up
Usage looks like:
```
import SchematicComponent from "@/components/schematic/SchematicComponent";

const ManagePlan = () => {
  if (!process.env.NEXT_PUBLIC_SCHEMATIC_COMPONENT_ID) {
    return <div>No component ID found</div>;
  }
  return (
    <div>
      <p>Other elements</p>
      <SchematicComponent
        componentId={process.env.NEXT_PUBLIC_SCHEMATIC_COMPONENT_ID}
      />
    </div>
  );
};
export default ManagePlan;
```
*/

async function SchematicComponent({ componentId }: { componentId: string }) {
  if (!componentId) {
    return <div>No component ID found</div>;
  }
  const temporaryAccessToken = await getTemporaryAccessToken(componentId);

  if (!temporaryAccessToken) {
    throw new Error("No access token found for user");
  }
  return (
    <SchematicEmbed
      accessToken={temporaryAccessToken}
      componentId={componentId}
    />
  );
}

export default SchematicComponent;

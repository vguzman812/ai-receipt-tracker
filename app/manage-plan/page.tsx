import SchematicComponent from "@/components/schematic/SchematicComponent";

const ManagePlan = () => {
  if (!process.env.NEXT_PUBLIC_SCHEMATIC_CUSTOMER_PORTAL_COMPONENT_ID) {
    return <div>No component ID found</div>;
  }
  return (
    <div>
      <SchematicComponent
        componentId={
          process.env.NEXT_PUBLIC_SCHEMATIC_CUSTOMER_PORTAL_COMPONENT_ID
        }
      />
    </div>
  );
};
export default ManagePlan;

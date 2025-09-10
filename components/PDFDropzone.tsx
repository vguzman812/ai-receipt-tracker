import { DndContext, useDroppable } from "@dnd-kit/core";

function PDFDropzone({ children }: { children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  return (
    <DndContext>
      <div ref={setNodeRef} style={style}>
        {children}
      </div>
    </DndContext>
  );
}
export default PDFDropzone;

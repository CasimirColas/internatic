import { createRoot } from "react-dom/client";
import { Dialog, DialogContent } from "@/components/shadcn/ui/dialog";

export const functionalPopup = (content: JSX.Element, className?: string) => {
  const node = document.createElement("div");
  document.body.appendChild(node);
  const root = createRoot(node);
  const PopupContent = () => {
    return (
      <Dialog defaultOpen onOpenChange={clear}>
        <DialogContent className={className}>{content}</DialogContent>
      </Dialog>
    );
  };

  const clear = async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    root.unmount();
    node.remove();
  };

  root.render(<PopupContent />);
};

export default functionalPopup;

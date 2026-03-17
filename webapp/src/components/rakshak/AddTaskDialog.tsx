import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultColumn?: string;
  onSubmit: (data: {
    title: string;
    details: string;
    status: string;
    category: string;
    priority: number;
  }) => void;
  editData?: {
    title: string;
    details: string;
    status: string;
    category: string;
    priority: number;
  } | null;
}

export function AddTaskDialog({
  open,
  onOpenChange,
  defaultColumn = "todo",
  onSubmit,
  editData,
}: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("backend");
  const [priority, setPriority] = useState("2");

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setDetails(editData.details);
      setCategory(editData.category);
      setPriority(String(editData.priority));
    } else {
      setTitle("");
      setDetails("");
      setCategory("backend");
      setPriority("2");
    }
  }, [editData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      details: details.trim(),
      status: editData?.status ?? defaultColumn,
      category,
      priority: Number(priority),
    });
    setTitle("");
    setDetails("");
    setCategory("backend");
    setPriority("2");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Details</Label>
            <Textarea
              id="desc"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Optional details..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="architecture">Architecture</SelectItem>
                  <SelectItem value="docs">Docs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">High</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {editData ? "Save" : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

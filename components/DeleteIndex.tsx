// components/DeleteIndex.tsx
import { useState } from "react";
import { Input, Button, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface DeleteIndexComponentProps {
  onDelete: (id: string) => Promise<void>;
}

const DeleteIndexComponent = (props: DeleteIndexComponentProps) => {
  const { onDelete } = props;
  const [id, setId] = useState("");

  const handleDelete = async () => {
    try {
      await onDelete(id);
      notification.success({
        message: "Success",
        description: `Deleted index with id: ${id}`,
      });
      setId("");
    } catch (error) {
      notification.error({
        message: "Error",
        description: `Failed to delete index with id: ${id}`,
      });
    }
  };

  return (
    <Input.Group compact>
      <Input
        style={{ width: "calc(100% - 40px)" }}
        placeholder="Index ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <Button
        type="primary"
        icon={<DeleteOutlined />}
        onClick={handleDelete}
        disabled={!id}
      />
    </Input.Group>
  );
};

export default DeleteIndexComponent;
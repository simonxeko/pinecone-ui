// Vector Edit Dialog


import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Input, Button, Spin, Table, Alert, message, Space, Select, Modal, Form } from "antd";
import { useQuery } from "react-query";
const { TextArea } = Input;

const EditDialog = (props: { id: string, index: string, doneEdit: Function}) => {

  const fetchVectorData = async () => {
    if (props.id === 'new') return [{key: 'text', value:''}];
    const res = await axios.post(`/api/pinecone/get`, {id: props.id, index: props.index});
    console.log("Fetch vector", res.data);
    if (!res.data.metadata) return [];
    const keys = Object.keys(res.data.metadata).filter((key) => key !== "id");
    const kv = keys.map((key) => ({
        key,
        value: res.data.metadata[key],
    }));
    return kv;
  }

  const [form] = Form.useForm();
  const [query, setQuery] = useState("");
  const { data } = useQuery(props.id, fetchVectorData);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const editVector = async () => {
    const id = props.id === 'new' ? '' : props.id;
    const text = form.getFieldValue('text');
    try {
      //const deleteResult = await axios.post("/api/pinecone/delete", { id });
      const insertResult = await axios.post("/api/pinecone/upsert", { id, index: props.index, text });
      messageApi.success(`Edited ${JSON.stringify(insertResult.data)}.`);
      props.doneEdit();
    } catch (error) {
      messageApi.error(`Failed to edit ${id}.`);
      props.doneEdit();
    }
  };

  return (
    <>
      {contextHolder}
      <Modal 
        title={`Edit ${props.id}`} 
        open={!!props.id}
        onOk={() => { editVector() }}
        onCancel={() => { props.doneEdit() }}>
        <Form layout="vertical" form={form}>
            {
                data?.map((item) => (
                    <Form.Item name={item.key} label={item.key}>
                        <TextArea defaultValue={item.value} />
                    </Form.Item>)
                )
            }
        </Form>
      </Modal>
    </>
  );
};

export default EditDialog;
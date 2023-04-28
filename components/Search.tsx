// components/SearchComponent.tsx
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Input, Button, Spin, Table, Alert, message, Space, Select, Form } from "antd";
import { DeleteFilled, EditOutlined, SearchOutlined } from "@ant-design/icons";
import EditDialog from "./VectorEdit";

const Indices = (props: {setIndex: Function}) => {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const defaultValue = 0;

  const fetchIndices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/pinecone/indices");
      setIndices(response.data.indices);
      setLoading(false);
      if (response.data.indices.length) {
        props.setIndex(response.data.indices[0]);
        form.setFieldValue("index", response.data.indices[0])
      }
    } catch (error) {
      console.error("Failed to fetch indices:", error);
    }
  };

  useEffect(() => {
    fetchIndices();
  }, []);

  return (
    <Form form={form} layout="inline">
      <Form.Item name="index">
        <Select size="large" style={{ width: 250 }} onChange={(p) => props.setIndex(p.currentValue)}>
          {indices.map((index, i) => (
            <Select.Option key={i}>{index}</Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [index, setIndex] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingVectorId, setEditingVectorId] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const deleteVector = async (id: string) => {
    try {
      const resp = await axios.post("/api/pinecone/delete", { id });
      console.log("Current result", results);
      setResults(results.filter((result) => result.id !== id));
      console.log("resp", resp);
      messageApi.success(`Deleted ${id}.`);
    } catch (error) {
      console.error("Failed to delete vector:", error);
    }
  };

  const calulateSimilarity = (score: number) => {
    const angle = Math.acos(score) * 180 / Math.PI;
    return Math.round(((90-angle)/90) * 10000) / 100;
  }

  const executeSearch = async (query: string) => {
    try {
      const embeddingResult = await axios.post('/api/embedding', { input: query });
      const vector = embeddingResult.data.result.embedding;
      const response = await axios.post("/api/pinecone/query", {
        vector: JSON.stringify(vector),
        index: index
      });

      const matches = response.data.matches.map((match) => ({ 
        id: match.id,
        score: calulateSimilarity(match.score), 
        actions: (
          <Space>
            <Button type="primary" onClick={() => setEditingVectorId(match.id)}><EditOutlined /></Button>
            <Button danger onClick={() => deleteVector(match.id)}><DeleteFilled /></Button>
          </Space>
        ),
        ...match.metadata
      }));
      return matches;
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    }
  };
  
  const handleSearch = async () => {
    setLoading(true);
    const searchResults = await executeSearch(query);
    console.log(searchResults);
    setResults(searchResults);
    setLoading(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  return (
    <>
      {contextHolder}
      <EditDialog 
        id={editingVectorId} 
        doneEdit={() => setEditingVectorId("")} 
      />
      <Space>
        <Indices setIndex={setIndex} />
        <Input
          placeholder="Search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={handleSearch}
          suffix={
            <Button
              icon={<SearchOutlined />}
              onClick={handleSearch}
              disabled={!query}
            />
          }
        />
        <Button size="large" type="primary" onClick={() => setEditingVectorId("new")}>Add</Button>
      </Space>
      <br/>
      <br/>
      <Spin spinning={loading}>
        <Table size="small" dataSource={results} columns={columns} rowKey="id" />
      </Spin>
    </>
  );
};

export default SearchComponent;
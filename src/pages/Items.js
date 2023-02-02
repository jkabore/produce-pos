import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Form, Input, Select } from "antd";
import { useDispatch } from "react-redux";
import { addItems } from "../redux/slices/cartSlice";
import axios from "axios";
import DefaultLayout from "../components/DefaultLayout";
import { showLoading } from "../redux/slices/cartSlice";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const Items = ({ item }) => {
  const dispatch = useDispatch();
  const [editingItem, setEditingItem] = useState(null);
  const loading = useSelector((state) => {
    return state.cart.loading;
  });
  const [itemData, setData] = useState([]);
  const [modalVisibilty, setModalVisibility] = useState(false);

  useEffect(() => {
    getAllItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getAllItems = () => {
    dispatch(showLoading(true));
    axios
      .get(`https://pos-server-zkti.onrender.com/api/item/items/all-items`)
      .then((response) => {
        const items = response.data;

        setData(items);
        dispatch(showLoading(false));
      })
      .catch((err) => {
        dispatch(showLoading(true));
        toast.error("Something went wrong !", {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };
  const deleteItem = (record) => {
    dispatch(showLoading(true));
    axios
      .post(`https://pos-server-zkti.onrender.com/api/item/delete-item`, {
        itemId: record._id,
      })
      .then((response) => {
        toast.success("Item deleted successfully !", {
          position: toast.POSITION.TOP_CENTER,
        });

        getAllItems();
        dispatch(showLoading(false));
        setModalVisibility(false);
      })
      .catch((err) => {
        dispatch(showLoading(true));

        toast.error("Something went wrong !", {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };
  const columns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "Image",
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt="" height={60} width={60} />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <DeleteOutlined className="mx-2" onClick={() => deleteItem(record)} />
          <EditOutlined
            className="mx-2"
            onClick={() => {
              setEditingItem(record);
              setModalVisibility(true);
            }}
          />
        </div>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const onFinish = (values) => {
    dispatch(showLoading(true));
    if (editingItem === null) {
      axios
        .post(`https://pos-server-zkti.onrender.com/api/item/add-item`, values)
        .then((response) => {
          dispatch(showLoading(false));
          toast.success("Item added successfully !", {
            position: toast.POSITION.TOP_CENTER,
          });
          getAllItems();

          setModalVisibility(false);
        })
        .catch((err) => {
          dispatch(showLoading(true));
          toast.error("Something went wrong !", {
            position: toast.POSITION.TOP_CENTER,
          });
          console.log(err);
        });
    } else {
      axios
        .post(`https://pos-server-zkti.onrender.com/api/item/edit-item`, {
          ...values,
          itemId: editingItem._id,
        })
        .then((response) => {
          dispatch(showLoading(false));
          toast.success("Item edited successfully !", {
            position: toast.POSITION.TOP_CENTER,
          });
          getAllItems();
          setEditingItem(null);

          setModalVisibility(false);
        })
        .catch((err) => {
          dispatch(showLoading(true));
          toast.error("Something went wrong !", {
            position: toast.POSITION.TOP_CENTER,
          });
          console.log(err);
        });
    }
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Items</h3>
        <Button type="primary" onClick={() => setModalVisibility(true)}>
          Add Item
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={itemData}
        onChange={onChange}
        bordered
      />

      {modalVisibilty && (
        <Modal
          onCancel={() => {
            setEditingItem(null);
            setModalVisibility(false);
          }}
          open={modalVisibilty}
          title={`${editingItem !== null ? `Edit Item` : `Add Item`}`}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={editingItem}
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Name required!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Price required!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="image"
              label="Image Url"
              rules={[
                {
                  required: true,
                  message: "Image required!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Category required!" }]}
            >
              <Select>
                <Select.Option value="fruits">Fruits</Select.Option>
                <Select.Option value="vegetables">Vegetables</Select.Option>
                <Select.Option value="meat">Meat</Select.Option>
              </Select>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                Save
              </Button>
            </div>
          </Form>
        </Modal>
      )}
      <ToastContainer />
    </DefaultLayout>
  );
};

export default Items;

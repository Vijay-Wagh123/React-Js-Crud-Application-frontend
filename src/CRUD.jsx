import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CRUD() {
  const [data, setData] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isActive, setIsActive] = useState(0);

  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [isEditActive, setIsEditActive] = useState(0);

  const getData = () => {
    axios
      .get("http://localhost:5198/api/Employee")
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {
    handleShow();
    axios
      .get(`http://localhost:5198/api/Employee/${id}`)
      .then((result) => {
        setEditName(result.data.name);
        setEditAge(result.data.age);
        setIsEditActive(result.data.isActive);
        setEditId(id);
        console.log(id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this item") == true) {
      const url = `http://localhost:5198/api/Employee/${id}`;

      axios
        .delete(url)
        .then((result) => {
          if (result.status == 200) {
            toast.success("Employee has been delete");
            getData();
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const handleUpdate = () => {
    console.log(editId);
    const url = `http://localhost:5198/api/Employee/${editId}`;
    const data = {
      Id: editId,
      name: editName,
      age: editAge,
      isActive: isEditActive,
    };
    axios
      .put(url, data)
      .then((result) => {
        getData();
        setEditName("");
        setEditAge("");
        setIsEditActive(0);
        setEditId("");
        handleClose();
        toast.success("Employee has been updated");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleSave = () => {
    const url = "http://localhost:5198/api/Employee";
    const data = {
      name: name,
      age: age,
      isActive: isActive,
    };
    axios.post(url, data).then((result) => {
      getData();
      setName("");
      setAge("");
      setIsActive(0);
      setEditName("");
      setEditAge("");
      setIsEditActive(0);
      toast.success("New Employee has been added!");
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Fragment>
      <ToastContainer></ToastContainer>
      <Container className="container">
        <Row>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Col>
          <Col style={{ marginTop: "5px" }}>
            <input
              type="checkbox"
              checked={isActive === 1}
              onChange={(e) => setIsActive(e.target.checked ? 1 : 0)}
            />
            <label>isActive</label>
          </Col>
          <Col>
            <button className="btn btn-primary" onClick={handleSave}>
              Submit
            </button>
          </Col>
        </Row>
      </Container>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th className="text-center">Name</th>
            <th className="text-center">Age</th>
            <th className="text-center">isActive</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0
            ? data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{item.name}</td>
                    <td className="text-center">{item.age}</td>
                    <td className="text-center">{item.isActive}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => {
                          handleEdit(item.id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            : "Loading......"}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your age"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
              />
            </Col>
            <Col style={{ marginTop: "5px" }}>
              <input
                type="checkbox"
                checked={isEditActive === 1}
                onChange={(e) => setIsEditActive(e.target.checked ? 1 : 0)}
              />
              <label>isActive</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

export default CRUD;

import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./MessageForm.css";

function MessageForm() {
  function handleSubmit(e) {
    e.preventDefault();
  }

  const user = useSelector((state) => state.user);

  return (
    <>
      <div className="messages-output">
        {" "}
        {!user && (
          <div style={{ margin: "20px" }} className="alert alert-danger">
            You are not logged in
          </div>
        )}
      </div>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Your message"
                disabled={!user}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              disabled={!user}
              variant="primary"
              type="submit"
              style={{ width: "100%" }}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default MessageForm;

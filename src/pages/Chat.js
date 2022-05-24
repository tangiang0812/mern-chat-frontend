import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import SideBar from "../components/Sidebar";
import MessageForm from "../components/MessageForm";

function Chat() {
  return (
    <Container>
      <Row>
        <Col md={4}>
          <SideBar></SideBar>
        </Col>
        <Col md={8}>
          <MessageForm></MessageForm>
        </Col>
      </Row>
    </Container>
  );
}

export default Chat;

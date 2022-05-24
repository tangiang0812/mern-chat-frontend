import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Home() {
  return (
    <Row>
      <Col
        md={6}
        className="d-flex flex-direction-columm align-items-center justify-content-center"
      >
        <div>
          <h1> Share the world with your firends</h1>
          <LinkContainer to="/chat">
            <Button variant="success">
              Get Started
              <i className="fas fa-comments home-message-icon"></i>
            </Button>
          </LinkContainer>
        </div>
      </Col>
    </Row>
  );
}

export default Home;

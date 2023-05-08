import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  CardGroup,
  FormGroup,
  FormControl,
  Form,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import moment from "moment";

import axiosConfig from "./config/axiosConfig";
import "./Home.css";
import Preloader from "./utils/Preloader";

const Home = ({ PaginationData }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [latestPosts, setLatestPosts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchData(currentPage);
  }, [filterValue, currentPage, latestPosts]);

  const fetchData = async (page) => {
    if (!filterValue && !latestPosts) {
      try {
        const response = await axiosConfig(
          `/search?tags=front_page&page=${page}`
        );

        setData(response.data.hits);
        setTotalPages(response.data.nbPages);
        setIsLoading(false);
        setFilterValue("");
        setLatestPosts(false);
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        console.log(error.message);
      }
    } else if (filterValue) {
      try {
        const response = await axiosConfig.get(
          `/search?query=${filterValue}&tags=story&page=${page}`
        );

        setData(response.data.hits);
        setTotalPages(response.data.nbPages);
        setIsLoading(false);
        setLatestPosts(false);
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        console.log(error);
      }
    } else if (latestPosts && !filterValue) {
      try {
        const response = await axiosConfig.get(
          `/search_by_date?tags=story&page=${page}`
        );

        setData(response.data.hits);
        setTotalPages(response.data.nbPages);
        setIsLoading(false);
        setFilterValue("");
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        console.log(error);
      }
    }
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const setLatestPost = (e) => {
    e.preventDefault();

    setLatestPosts(!latestPosts);
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <h1 style={{ color: "ff9494" }}>{errorMessage}</h1>;
  }
  if (!data.length) {
    setError(true);
    setErrorMessage("404: Data is empty");
  }

  return (
    <div>
      <Form inline={true.toString()}>
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Search..."
            value={filterValue}
            onChange={handleFilterChange}
          />
        </FormGroup>
      </Form>
      <ButtonGroup>
        <Button
          variant={latestPosts ? "primary" : "secondary"}
          onClick={setLatestPost}
        >
          {latestPosts ? "Latest Posts" : "Popular Posts"}
        </Button>
      </ButtonGroup>
      <div className="d-inline-flex">
        <Row>
          <Row className="card-deck">
            {data?.map((card, i) => (
              <Col md={4} key={i} className="cards-container">
                <CardGroup>
                  <Card style={{ height: "300px" }}>
                    <Card.Body>
                      <Card.Title>{card?.title}</Card.Title>
                      <Card.Text>Points: {card?.points}</Card.Text>
                      <Card.Text>Author: {card?.author}</Card.Text>
                      <Card.Text>
                        Created At:{" "}
                        {moment(card?.created_at_i).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </Card.Text>
                      <Card.Text>
                        Number of comments: {card?.num_comments}
                      </Card.Text>
                      <Card.Text>
                        URL: <a href={card?.url}> {card?.url}</a>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </CardGroup>
              </Col>
            ))}
          </Row>
        </Row>
      </div>
      <PaginationData
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Home;

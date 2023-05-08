//eslint-disable

import React, { useCallback, useEffect, useState } from "react";
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
  const [isLatestPosts, setIsLatestPosts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = useCallback(
    async (page) => {
      if (!filterValue && !isLatestPosts) {
        try {
          const response = await axiosConfig(
            `/search?tags=front_page&page=${page}`
          );

          setData(response.data.hits);
          setTotalPages(response.data.nbPages);
          setIsLoading(false);
          setFilterValue("");
          setIsLatestPosts(false);
        } catch (error) {
          setIsError(true);
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
          setIsLatestPosts(false);
        } catch (error) {
          setIsError(true);
          setErrorMessage(error.message);
          console.log(error);
        }
      } else if (isLatestPosts && !filterValue) {
        try {
          const response = await axiosConfig.get(
            `/search_by_date?tags=story&page=${page}`
          );

          setData(response.data.hits);
          setTotalPages(response.data.nbPages);
          setIsLoading(false);
          setFilterValue("");
        } catch (error) {
          setIsError(true);
          setErrorMessage(error.message);
          console.log(error);
        }
      }
    },
    [filterValue, isLatestPosts]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [filterValue, currentPage, isLatestPosts, fetchData]);

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const setLatestPost = (e) => {
    e.preventDefault();

    setIsLatestPosts(!isLatestPosts);
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (isError) {
    return <h1 style={{ color: "ff9494" }}>{errorMessage}</h1>;
  }
  if (!data.length) {
    setIsError(true);
    setErrorMessage("404: Data is empty reload to see the popular data.");
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
      Click to see latest and popular posts{" "}
      <ButtonGroup>
        <Button
          variant={isLatestPosts ? "primary" : "secondary"}
          onClick={setLatestPost}
        >
          {isLatestPosts ? "Latest Posts" : "Popular Posts"}
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

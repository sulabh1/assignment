import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationData = ({ currentPage, totalPages, onPageChange }) => {
  const pageItems = [];
  const numPagesToShow = 10;
  const firstPage = Math.max(currentPage - Math.floor(numPagesToShow / 2), 1);
  const lastPage = Math.min(firstPage + numPagesToShow - 1, totalPages);

  for (let i = firstPage; i <= lastPage; i++) {
    pageItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>
      <Pagination.First onClick={() => onPageChange(1)} />
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {pageItems}
      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <Pagination.Last onClick={() => onPageChange(totalPages)} />
    </Pagination>
  );
};

export default PaginationData;

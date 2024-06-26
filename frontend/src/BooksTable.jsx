import { useQuery } from 'react-query';

async function fetchBooks() {
  const response = await fetch('http://127.0.0.1:3000/books');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

function BooksTable() {
  const { data: books, error, isLoading } = useQuery('books', fetchBooks);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="overflow-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Published Date</th>
          </tr>
        </thead>
        <tbody>
          {books?.data?.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.name}</td>
              <td>{book.description}</td>
              <td>{book.price}</td>
              <td>{book.publishDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BooksTable;
import "./style.scss";
import axios from "axios";

let input;
let books = [];
const headerElem = document.querySelector("#header");
const appElem = document.querySelector("#app");

headerElem.innerHTML = `
<h1>Gutenberg Project</h1>
<div>
<form>
<input type="text" class="inputSearch searchText">
<button class="btnSearch">Search</button></form></div>`;

const inputSearch = document.querySelector(".inputSearch");
const btnSearch = document.querySelector(".btnSearch");

const getBookUrl = (rawBook) => {
  let url = "";
  const formatPairs = Object.entries(rawBook.formats);
  formatPairs.forEach(([key, value]) => {
    if (
      value.endsWith(".txt") ||
      value.endsWith(".htm") ||
      value.endsWith(".html.images")
    ) {
      url = value;
    }
  });
  return url;
};

const getBooks = async (searchText) => {
  const url = `https://gutendex.com/books/?search=${searchText}`;
  const response = await axios.get(url);
  const rawBooks = response.data.results;
  rawBooks.forEach((rawBook) => {
    books.push({
      title: rawBook.title,
      imageUrl: rawBook.formats["image/jpeg"]
        ? rawBook.formats["image/jpeg"]
        : "images/blank.png",
      author:
        rawBook.authors && rawBook.authors.length > 0
          ? rawBook.authors[0].name
          : "(no author listed)",
      bookUrl: getBookUrl(rawBook),
    });
  });
  return books;
};

btnSearch.addEventListener("click", async (e) => {
  e.preventDefault();
  input = inputSearch.value;
  getBooks(input);
  appElem.innerHTML = `Loading... Please wait.`;
  setTimeout(function () {
    appElem.innerHTML = `<ul>
    ${books
      .map((book) => {
        return `<a href="${book.bookUrl}"<li class="book">${book.title} <span class="info author">${book.author}</span>
        <span> <image class="book cover" src="${book.imageUrl}"></image></span></li></a>`;
      })
      .join(``)}
    </ul>`;
  }, 2500);
});

console.log(books);

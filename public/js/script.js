function showSearchResults(bookDetails) {
  document.getElementById('bookList').innerHTML = '';
  if (bookDetails.details.length > 0) {
    bookDetails.details.map((bookDetail) => {
      const {
        id,
        title,
        authors,
        description,
        pointValue,
        thumbnail,
      } = bookDetail;

      let finalDescription =
        description.length > 150
          ? `${description.substring(
              0,
              150,
            )}<span id="dots_${id}">...</span><span id="more_${id}" class="more">${description.substring(
              150,
            )}</span> <a id="readMore_${id}" class="link">Read More</a>`
          : description;

      // const finalDescription = description;

      // console.log(finalDescription);

      const list = document.getElementById('bookList');

      const listEl = document.createElement('li');

      const bookThumbnail = document.createElement('img');
      if (thumbnail) bookThumbnail.src = thumbnail;
      bookThumbnail.alt = 'Book Image';
      bookThumbnail.height = 200;
      bookThumbnail.width = 150;

      const mainDiv = document.createElement('div');
      mainDiv.classList.add('book-main');

      const bookThumbnailDiv = document.createElement('div');
      bookThumbnailDiv.classList.add('book-thumbnail');

      const bookDetailsDiv = document.createElement('div');
      bookDetailsDiv.classList.add('book-details');

      const bookTitleDiv = document.createElement('div');
      bookTitleDiv.classList.add('book-title');

      bookTitleDiv.innerHTML = `<strong>${title}</strong>`;

      const bookAuthorDiv = document.createElement('div');
      bookAuthorDiv.classList.add('book-author');

      bookAuthorDiv.innerHTML = `Author/s: <strong>${authors}</strong>`;

      const bookPointsDiv = document.createElement('div');
      bookPointsDiv.classList.add('book-points');

      bookPointsDiv.innerHTML = `<strong>Maximum Points:</strong> ${
        pointValue || 'NA'
      }`;

      const bookDescriptionDiv = document.createElement('div');
      bookDescriptionDiv.classList.add('book-description');

      const descParagraph = document.createElement('p');

      descParagraph.innerHTML = `<strong>Description: </strong>${finalDescription}`;

      /*if (description.length > 200) {
        const readMore = document.createElement('button');
        readMore.id = `readMore_${id}`;
        readMore.innerHTML = 'Read More';
        readMore.onclick = readMoreDesc.bind(null, id);
        bookDescriptionDiv.appendChild(descParagraph);
        bookDescriptionDiv.appendChild(readMore);
      } else {
        bookDescriptionDiv.appendChild(descParagraph);
      }*/

      bookDescriptionDiv.appendChild(descParagraph);

      bookThumbnailDiv.appendChild(bookThumbnail);

      bookDetailsDiv.appendChild(bookTitleDiv);
      bookDetailsDiv.appendChild(bookAuthorDiv);
      bookDetailsDiv.appendChild(bookPointsDiv);
      bookDetailsDiv.appendChild(bookDescriptionDiv);

      mainDiv.appendChild(bookThumbnailDiv);
      mainDiv.appendChild(bookDetailsDiv);

      listEl.appendChild(mainDiv);
      list.appendChild(listEl);

      const readMoreAction = document.getElementById(
        `readMore_${id}`,
      );
      if (readMoreAction)
        readMoreAction.onclick = readMoreDesc.bind(null, id);
    });
  }
}

document
  .getElementById('searchBook')
  .addEventListener('keyup', () => {
    document.getElementById('loader').style.display = 'block';
    const bookNameToSearch = document.getElementById('searchBook')
      .value;
    (async function getBooks() {
      try {
        let items = '';
        if (bookNameToSearch.trim()) {
          const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${bookNameToSearch}&maxResults=40&orderBy:relevance`;

          const response = await axios.get(url);

          // console.log(response.data);

          if (response.data.totalItems > 0)
            items = response.data.items;
          else items = '';
        } else {
          items = '';
        }

        const bookDetails = { details: [] };

        if (items) {
          items.map((item) => {
            let authors = '';
            let thumbnail = '';
            let title = '';
            let description = '';

            const id = item.id;

            if (item.volumeInfo.title) title = item.volumeInfo.title;
            else title = 'NA';

            if (item.volumeInfo.subtitle)
              title += `: ${item.volumeInfo.subtitle}`;

            if (item.volumeInfo.description)
              description = item.volumeInfo.description;
            else description = 'NA';

            if (item.volumeInfo.authors) {
              item.volumeInfo.authors.map((author) => {
                authors += `, ${author}`;
              });
              authors = authors.substring(1);
            } else authors = 'NA';

            thumbnail = item.volumeInfo.imageLinks?.thumbnail;

            const pointValue = item?.saleInfo?.retailPrice?.amount
              ? Math.floor(item?.saleInfo?.retailPrice?.amount / 2)
              : undefined;

            const bookDetail = {
              id,
              title,
              authors,
              description,
              pointValue,
              thumbnail,
            };

            bookDetails.details.push(bookDetail);
          });
        }

        showSearchResults(bookDetails);

        // console.log(bookDetails);
      } catch (err) {
        console.log(err);
      }
    })();
    document.getElementById('loader').style.display = 'none';
  });

function readMoreDesc(id) {
  var dots = document.getElementById(`dots_${id}`);
  var moreText = document.getElementById(`more_${id}`);
  var btnText = document.getElementById(`readMore_${id}`);

  console.log(id);
  if (dots) {
    if (dots.style.display === 'none') {
      dots.style.display = 'inline';
      btnText.innerHTML = 'Read more';
      moreText.style.display = 'none';
    } else {
      dots.style.display = 'none';
      btnText.innerHTML = 'Read less';
      moreText.style.display = 'inline';
    }
  }
}

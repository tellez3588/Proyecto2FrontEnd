import React, { useState, useEffect } from 'react';
import NavbarUser from '../components/Navbar';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Cards from '../components/Cards';
import '../styles/Home.css'

function Home() {

  const newsUrl = "http://localhost:4000/api/news/"
  const categoriesUrl = "http://localhost:4000/api/category/"

  const [news, setNews] = useState([]);
  const [category, setCategory] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [userId, setUserId] = useState('');

  let tokenUser = JSON.parse(localStorage.getItem('token'));
  let user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    getUser();
    getNews();
    getCategories();
  }, []);

  const getUser = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const userid = urlParams.get('userid');
      if (userid) {
        setUserId(userid);
        console.log(userid)
      }
    } catch (error) {
      console.log(error);
    }
  }
    

  const getNews = async () => {
    try {
      const datos = await axios.get(newsUrl);
      setNews(datos.data.filter((element) => element.userId === user._id));
    } catch (e) {
      console.log(e);
    }
  };
  


  const getCategories = async () => {
    try {
      const datos = await axios.get(categoriesUrl, {
        headers:{'Authorization ' : ' Bearer ' + tokenUser }
      });
      setCategoriesList(datos.data);
      console.log(datos.data)
    } catch (e) {
      console.log(e);
    }
  };
  


  const handleCategoryChange = (category) => {
    setCategory(category === "Todas" ? null : category);
  };

  const filteredNews = category && category !== "Todas"
    ? news.filter((item) => item.category === category)
    : news;



  return (
    <>
      <NavbarUser />
      <h1>NEWS COVER</h1>
      <div className='categorias'>
        <FloatingLabel className="mb-3" controlId="floatingSelect" label="Select category">
          <Form.Select className="select" aria-label="Floating label select example" value={category} onChange={(e) => setCategory(e.target.value)} onclick={() => handleCategoryChange(category)}>
            {categoriesList.map((cat) => {
              return (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              );
            })}
          </Form.Select>
        </FloatingLabel>
      </div>
      <div className='noticias'>
        {
          filteredNews.map((item) => (
            <Cards item={item} key={item._id} />
          ))
        }
      </div>

    </>
  )
}

export default Home

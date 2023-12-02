import React from 'react'
import Header from  '../../components/nav/Header'
import './about.css'

const About = () => {
  const list = [
    {
      title: '"The Diary of a Young Girl" by Anne Frank',
      content:
        'Chronicles the life of Anne Frank, a Jewish girl, during World War II, as shehides with her family in Amsterdam, documented through her personal diary.'
    },
    {
      title: '"Steve Jobs" by Walter Isaacson',
      content:
        'A biography detailing the life of Steve Jobs, co-founder of Apple Inc., exploring his impact on the tech industry and various aspects of his personal life.'
    },
    {
      title: '"The Wright Brothers" by David McCullough',
      content:
        'Chronicles the lives of Wilbur and Orville Wright, the pioneers of aviation, focusing on their achievements leading to the first controlled powered flight.'
    },
    {
      title: '"Einstein: His Life and Universe" by Walter Isaacson',
      content: `Walter Isaacson's biography of Albert Einstein, exploring both his personal life and scientific contributions to physics.`
    },
    {
      title: '"Unbroken" by Laura Hillenbrand',
      content:
        'The biography of Louis Zamperini, an Olympic athlete and World War II veteran, focusing on his resilience and survival after being a prisoner of war.'
    },
    {
      title: '"Leonardo da Vinci" by Walter Isaacson',
      content:
        'Another work by Walter Isaacson, this biography delves into the life and genius of the Italian Renaissance polymath Leonardo da Vinci.'
    }
  ]

  return (
    <>
      <Header />
      <div className='about-container'>
        <h2 className='title'>Book Review Club</h2>
        <div className='desc-container'>
          <div className='desc'>
            Welcome to the Book Review Club, a community where literature enthusiasts gather to
            share their thoughts and insights on a diverse range of books. Our club is a haven for
            avid readers, offering a platform to discuss, critique, and celebrate the world of
            literature. Immerse yourself in a vibrant community of like-minded individuals who are
            passionate about the written word. Whether you're a seasoned bibliophile or just
            starting your literary journey, our club provides a welcoming space for all. Engage in
            lively discussions, explore thought-provoking book reviews, and discover hidden literary
            gems recommended by fellow members. At the Book Review Club, we believe in the power of
            words to inspire, connect, and broaden perspectives. Join us on this literary adventure,
            where every page turned is an opportunity to share, learn, and celebrate the magic of
            storytelling. Let the discussions begin, and let the love for books unite us in this
            literary exploration!
          </div>
        </div>

        <div className='content-container'>
          <div>
            <h2 className='content-title'>Biography of a Person</h2>
            <div className='person-wrap'>
              {list.map((v, i) => (
                <div className='item' key={i}>
                  <div className='item-title'>{v.title}</div>
                  <div className='item-content'>{v.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About

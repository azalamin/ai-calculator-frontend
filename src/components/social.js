import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import './social.css';

const Social = () => {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch comments from the backend
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:3002/get_comments');
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [comments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3002/post_comment', {
        name,
        email,
        comment,
      });

      // Ensure the new comment includes the createdAt field
      const newComment = {
        ...response.data.result,
        createdAt: new Date().toISOString(), // Set the current time
      };

      setComments([...comments, newComment]);
      setName('');
      setEmail('');
      setComment('');
      setError('');
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="social-container">
      <div className="container my-5">
        <div className="container my-5">
          <div style={{ maxWidth: '700px', top: '-80px' }} className="mx-auto text-secondary">
            <h1 className="font-weight-bold text-dark">Revenge of the Never Trumpers</h1>
            <p className="my-2" style={{ lineHeight: '2' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since.
            </p>

            <div className="my-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <img
                  src="https://avatars0.githubusercontent.com/u/39916324?s=460&u=602ca47fcce463981a2511a21148236f304ec934&v=4"
                  style={{ width: '50px', borderRadius: '50%' }}
                  alt="avatar"
                />

                <small className="ml-2">
                  <a href="#" className="text-primary d-block">
                    Ahmad Sultani
                  </a>
                  <span>Aug 18</span>
                </small>
              </div>
              <div className="text-primary">
                <a href="/#" className="mx-1">
                  <svg
                    fill="currentColor"
                    width="30px"
                    viewBox="0 0 24 24"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                    xmlnsSerif="http://www.serif.com/"
                    style={{
                      fillRule: 'evenodd',
                      clipRule: 'evenodd',
                      strokeLinejoin: 'round',
                      strokeMiterlimit: '2',
                    }}
                  >
                    <path
                      id="Twitter"
                      d="M24,12c0,6.627 -5.373,12 -12,12c-6.627,0 -12,-5.373 -12,-12c0,-6.627 5.373,-12 12,-12c6.627,0 12,5.373 12,12Zm-6.465,-3.192c-0.379,0.168 -0.786,0.281 -1.213,0.333c0.436,-0.262 0.771,-0.676 0.929,-1.169c-0.408,0.242 -0.86,0.418 -1.341,0.513c-0.385,-0.411 -0.934,-0.667 -1.541,-0.667c-1.167,0 -2.112,0.945 -2.112,2.111c0,0.166 0.018,0.327 0.054,0.482c-1.754,-0.088 -3.31,-0.929 -4.352,-2.206c-0.181,0.311 -0.286,0.674 -0.286,1.061c0,0.733 0.373,1.379 0.94,1.757c-0.346,-0.01 -0.672,-0.106 -0.956,-0.264c-0.001,0.009 -0.001,0.018 -0.001,0.027c0,1.023 0.728,1.877 1.694,2.07c-0.177,0.049 -0.364,0.075 -0.556,0.075c-0.137,0 -0.269,-0.014 -0.397,-0.038c0.268,0.838 1.048,1.449 1.972,1.466c-0.723,0.566 -1.633,0.904 -2.622,0.904c-0.171,0 -0.339,-0.01 -0.504,-0.03c0.934,0.599 2.044,0.949 3.237,0.949c3.883,0 6.007,-3.217 6.007,-6.008c0,-0.091 -0.002,-0.183 -0.006,-0.273c0.413,-0.298 0.771,-0.67 1.054,-1.093Z"
                    ></path>
                  </svg>
                </a>
                <a href="/#" className="w-6 mx-1">
                  <svg
                    fill="currentColor"
                    width="30px"
                    viewBox="0 0 24 24"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                    xmlnsSerif="http://www.serif.com/"
                    style={{
                      fillRule: 'evenodd',
                      clipRule: 'evenodd',
                      strokeLinejoin: 'round',
                      strokeMiterlimit: '2',
                    }}
                  >
                    <path
                      id="Facebook"
                      d="M24,12c0,6.627 -5.373,12 -12,12c-6.627,0 -12,-5.373 -12,-12c0,-6.627 5.373,-12 12,-12c6.627,0 12,5.373 12,12Zm-11.278,0l1.294,0l0.172,-1.617l-1.466,0l0.002,-0.808c0,-0.422 0.04,-0.648 0.646,-0.648l0.809,0l0,-1.616l-1.295,0c-1.555,0 -2.103,0.784 -2.103,2.102l0,0.97l-0.969,0l0,1.617l0.969,0l0,4.689l1.941,0l0,-4.689Z"
                    ></path>
                  </svg>
                </a>
                <a href="/#" className="w-6 mx-1">
                  <svg
                    fill="currentColor"
                    width="30px"
                    viewBox="0 0 24 24"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                    xmlnsSerif="http://www.serif.com/"
                    style={{
                      fillRule: 'evenodd',
                      clipRule: 'evenodd',
                      strokeLinejoin: 'round',
                      strokeMiterlimit: '2',
                    }}
                  >
                    <path
                      id="Shape"
                      d="M7.3,0.9c1.5,-0.6 3.1,-0.9 4.7,-0.9c1.6,0 3.2,0.3 4.7,0.9c1.5,0.6 2.8,1.5 3.8,2.6c1,1.1 1.9,2.3 2.6,3.8c0.7,1.5 0.9,3 0.9,4.7c0,1.7 -0.3,3.2 -0.9,4.7c-0.6,1.5 -1.5,2.8 -2.6,3.8c-1.1,1 -2.3,1.9 -3.8,2.6c-1.5,0.7 -3.1,0.9 -4.7,0.9c-1.6,0 -3.2,-0.3 -4.7,-0.9c-1.5,-0.6 -2.8,-1.5 -3.8,-2.6c-1,-1.1 -1.9,-2.3 -2.6,-3.8c-0.7,-1.5 -0.9,-3.1 -0.9,-4.7c0,-1.6 0.3,-3.2 0.9,-4.7c0.6,-1.5 1.5,-2.8 2.6,-3.8c1.1,-1 2.3,-1.9 3.8,-2.6Zm-0.3,7.1c0.6,0 1.1,-0.2 1.5,-0.5c0.4,-0.3 0.5,-0.8 0.5,-1.3c0,-0.5 -0.2,-0.9 -0.6,-1.2c-0.4,-0.3 -0.8,-0.5 -1.4,-0.5c-0.6,0 -1.1,0.2 -1.4,0.5c-0.3,0.3 -0.6,0.7 -0.6,1.2c0,0.5 0.2,0.9 0.5,1.3c0.3,0.4 0.9,0.5 1.5,0.5Zm1.5,10l0,-8.5l-3,0l0,8.5l3,0Zm11,0l0,-4.5c0,-1.4 -0.3,-2.5 -0.9,-3.3c-0.6,-0.8 -1.5,-1.2 -2.6,-1.2c-0.6,0 -1.1,0.2 -1.5,0.5c-0.4,0.3 -0.8,0.8 -0.9,1.3l-0.1,-1.3l-3,0l0.1,2l0,6.5l3,0l0,-4.5c0,-0.6 0.1,-1.1 0.4,-1.5c0.3,-0.4 0.6,-0.5 1.1,-0.5c0.5,0 0.9,0.2 1.1,0.5c0.2,0.3 0.4,0.8 0.4,1.5l0,4.5l2.9,0Z"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <img
            className="w-100 my-3"
            src="https://api.time.com/wp-content/uploads/2020/07/never-trumpers-2020-election-01.jpg?quality=85&w=1201&h=676&crop=1"
            alt="Header"
          />

          <div style={{ maxWidth: '700px', top: '-80px' }} className="mx-auto text-secondary">
            <p className="my-2" style={{ lineHeight: '2' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
              make a type specimen book. It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
              including versions of Lorem Ipsum.
            </p>

            <h3 className="font-weight-bold text-dark">#1. What is Lorem Ipsum?</h3>
            <p className="my-2" style={{ lineHeight: '2' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
              make a type specimen book. It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
              including versions of Lorem Ipsum.
            </p>
            <video width="560" height="315" controls>
              <source src={process.env.PUBLIC_URL + '/video.mp4'} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h3 className="font-weight-bold text-dark">#2. What is Lorem Ipsum?</h3>
            <p className="my-2" style={{ lineHeight: '2' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
              make a type specimen book. It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
              including versions of Lorem Ipsum.
            </p>

            <blockquote className="text-primary p-3 font-italic" style={{ borderLeft: '4px solid black', lineHeight: '2' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s
            </blockquote>

            <p className="my-2" style={{ lineHeight: '2' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
              make a type specimen book. It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
              including versions of Lorem Ipsum.
            </p>

            <div className="my-3">
              <small>
                <a href="#" className="text-primary">
                  #election
                </a>
                ,{' '}
                <a href="#" className="text-primary">
                  #politics
                </a>
                ,{' '}
                <a href="#" className="text-primary">
                  #trump
                </a>
                ,{' '}
                <a href="#" className="text-primary">
                  #revenge
                </a>
                ,{' '}
                <a href="#" className="text-primary">
                  #2020
                </a>
              </small>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="be-comment-block">
            <h1 className="comments-title">Comments ({comments.length})</h1>

            {comments.map((comment) => (
              <div key={comment._id} className="be-comment">
                <div className="be-img-comment">
                  <a href="#">
                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" className="be-ava-comment" />
                  </a>
                </div>
                <div className="be-comment-content">
                  <span className="be-comment-name">
                    <a href="#">{comment.name}</a>
                  </span>
                  <span className="be-comment-time">
                    <i className="fa fa-clock-o"></i> {new Date(comment.createdAt).toLocaleString()}
                  </span>
                  <p className="be-comment-text">
                    {comment.comment}
                  </p>
                </div>
              </div>
            ))}

            {/* Comment Form */}
            <form className="form-block" onSubmit={handleCommentSubmit}>
              <div className="row">
                <div className="col-xs-12 col-sm-6">
                  <div className="form-group fl_icon">
                    <div className="icon"><i className="fa fa-user"></i></div>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 fl_icon">
                  <div className="form-group fl_icon">
                    <div className="icon"><i className="fa fa-envelope-o"></i></div>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-xs-12">
                  <div className="form-group">
                    <textarea
                      className="form-input"
                      required
                      placeholder="Your text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <button className="btn btn-primary pull-right" type="submit" disabled={loading}>
                  {loading ? <ClipLoader size={20} color={"#fff"} loading={true} /> : 'Submit'}
                </button>
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;

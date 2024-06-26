import React from 'react';
import './footer.css';

import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo2.png';

const quick__links = [
    {
        path:'/home',
        display:'Home'
    },
    {
        path:'/flights',
        display:'Flights'
    },
    {
        path:'/about',
        display:'About'
    }, 
]

const quick__links2 = [
    {
        path:'/login',
        display:'Login'
    },
    {
        path:'/register',
        display:'Register'
    },
]

const Footer = () => {
    return (<footer className="footer">
        <Container>
            <Row>
                <Col lg='3'>
                    <div className="logo">
                        <img src={logo} alt="" />
                        <p>Welcome to Vacay Buddy, your trusted companion in curating unforgettable travel experiences. </p>

                        <div className="social__links d-flex align-items-center gap-4">
                            <span>
                                <Link to='#'><i className="ri-youtube-line"></i></Link>
                            </span>
                            <span>
                                <Link to='#'><i className="ri-github-fill"></i></Link>
                            </span>
                            <span>
                                <Link to='#'><i className="ri-facebook-circle-line"></i></Link>
                            </span>
                            <span>
                                <Link to='#'><i className="ri-instagram-line"></i></Link>
                            </span>
                        </div>
                    </div>
                </Col>

                <Col lg='3'>
                    <h5 className='footer__link-title'>Discover</h5>
                    <ListGroup className='footer__quick-links'>
                        {
                            quick__links.map((item, index) => (
                                <ListGroupItem key={index} className='ps-0 border-0'>
                                    <Link to={item.path}>{item.display}</Link>
                                </ListGroupItem>
                            ))

                        }
                    </ListGroup>
                </Col>
                <Col lg='3'>
                    <h5 className='footer__link-title'>Quick links</h5>
                    <ListGroup className='footer__quick-links'>
                        {
                            quick__links2.map((item, index) => (
                                <ListGroupItem key={index} className='ps-0 border-0'>
                                    <Link to={item.path}>{item.display}</Link>
                                </ListGroupItem>
                            ))

                        }
                    </ListGroup>
                </Col>
                <Col lg='3'>
                    <h5 className='footer__link-title'>Contact</h5>
                    <ListGroup className='footer__quick-links'>
                        <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3'>
                            <h6 className='mb-0 d-flex align-items-center gap-2'>
                            <span><i class="ri-map-pin-line"></i></span>
                            Address:
                            </h6> 
                            <p className='mb-0'>Bloomington, Indiana</p>
                        </ListGroupItem>
                        <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3'>
                            <h6 className='mb-0 d-flex align-items-center gap-2'>
                            <span><i class="ri-mail-line"></i></span>
                            Email:
                            </h6> 
                            <p className='mb-0'>vacaybuddy@iu.com</p>
                        </ListGroupItem>
                        <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3'>
                            <h6 className='mb-0 d-flex align-items-center gap-2'>
                            <span><i class="ri-phone-fill"></i></span>
                            Phone:
                            </h6> 
                            <p className='mb-0'>+11122334455</p>
                        </ListGroupItem>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    </footer>)
}

export default Footer;
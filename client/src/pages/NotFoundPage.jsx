import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/common/Container.jsx';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';
import { HiHome, HiExclamationTriangle } from 'react-icons/hi2';

export const NotFoundPage = () => {
  return (
    <div className="py-24 flex items-center justify-center">
      <Container className="max-w-lg text-center">
        <Card className="p-10 border-orange-500/30">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center mx-auto mb-4">
            <HiExclamationTriangle className="w-8 h-8" />
          </div>
          <span className="text-6xl font-black text-white text-gradient-orange">404</span>
          <h2 className="text-2xl font-bold text-white mt-2 mb-2">
            Industrial Component Not Found
          </h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            The page or equipment specification you are looking for has been relocated or does not exist.
          </p>
          <Link to="/">
            <Button variant="primary" icon={HiHome}>
              Return to Enterprise Home
            </Button>
          </Link>
        </Card>
      </Container>
    </div>
  );
};

export default NotFoundPage;

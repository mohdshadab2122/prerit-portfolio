/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Education from './pages/Education';
import Experience from './pages/Experience';
import Publications from './pages/Publications';
import Awards from './pages/Awards';
import IntellectualProperty from './pages/IntellectualProperty';
import Contact from './pages/Contact';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="education" element={<Education />} />
          <Route path="experience" element={<Experience />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="awards" element={<Awards />} />
          <Route path="/intellectual-property" element={<IntellectualProperty />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

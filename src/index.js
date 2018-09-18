import 'purecss';
import 'react';
import 'react-dom';
import './main.css';
import component from './component';
// Tree Shaking
import {bake} from './shake';
bake();
document.body.appendChild(component());

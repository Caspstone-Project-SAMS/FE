import { useDispatch as _useDispatch } from 'react-redux';
import { AppDispatch } from './Store';

const useDispatch = (): AppDispatch => _useDispatch();

export default useDispatch;

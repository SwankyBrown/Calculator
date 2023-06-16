
import { useReducer } from 'react';
import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';


export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: 'evaluate'
}


function reducer(state, {type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if ( state.overwrite) {
        return{
          ...state,
          currentOperend: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperend === "0") {
        return state }

      if (payload.digit === "." && state.currentOperend.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOperend: `${state.currentOperend || ""}${payload.digit}`
      }
        case ACTIONS.CHOOSE_OPERATION: 
        if (state.currentOperend == null && state.previousOperend == null) {
          return state
        }

        if ( state.currentOperend == null) {
          return {
            ...state,
            operation:payload.operation
          }
        }

        if (state.previousOperend == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperend: state.currentOperend,
            currentOperend: null,
          }
        }


        return{
          ...state,
          previousOperend: evaluate(state),
          operation: payload.operation,
          currentOperend: null

        }
      case ACTIONS.CLEAR: 
      return {}
      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperend: null
          }
        }
        
        if (state.currentOperend == null) return state
        if (state.currentOperend.length === 1) {
          return { ...state, currentOperend: null}
        }

        return {
          ...state,
          currentOperend: state.currentOperend.slice(0, -1)
        }
      case ACTIONS.EVALUATE:
        if (state.operation == null ||
          state.currentOperend == null ||
          state.previousOperend == null
          
          ) {
            return state
          }

          return {
            ...state,
            overwrite: true,
            previousOperend: null,
            operation: null, 
            currentOperend: evaluate(state),
          }
  }

}

function evaluate({ currentOperend, previousOperend, operation}) {
  const prev = parseFloat(previousOperend)
  const current = parseFloat(currentOperend)
  if (isNaN(prev) || isNaN(current)) return ''
  let computation = ''
  switch (operation) {
    case '+':
      computation = prev + current
      break
      case '-':
        computation = prev - current
        break
        case '*':
          computation = prev * current
          break
          case '÷':
            computation = prev / current
            break
  }

  return computation.toString()

}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})
function formatOperand(operend) {
  if(operend == null) return
  const [integer, decimal] = operend.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
}

function App() {
const [{ currentOperend, previousOperend, operation }, dispatch] = useReducer(reducer, {})



  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className='previous-operand'>{previousOperend} {operation}</div>
        <div className='current-operand'>{currentOperend}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button  onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      {/* <DigitButton digit='÷' dispatch={dispatch}/> */}
     
     
     
      <OperationButton operation='÷' dispatch={dispatch}/>
      <DigitButton digit='1' dispatch={dispatch}/>
      <DigitButton digit='2' dispatch={dispatch}/>
      <DigitButton digit='3' dispatch={dispatch}/>
      <OperationButton operation='*' dispatch={dispatch}/>
      <DigitButton digit='4' dispatch={dispatch}/>
      <DigitButton digit='5' dispatch={dispatch}/>
      <DigitButton digit='6' dispatch={dispatch}/>
      <OperationButton operation='+' dispatch={dispatch}/>
      <DigitButton digit='7' dispatch={dispatch}/>
      <DigitButton digit='8' dispatch={dispatch}/>
      <DigitButton digit='9' dispatch={dispatch}/>
      <OperationButton operation='-' dispatch={dispatch}/>
      <DigitButton digit='.' dispatch={dispatch}/>
      <DigitButton digit='0' dispatch={dispatch}/>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;

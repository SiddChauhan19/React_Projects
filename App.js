import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './App.css';

//contains all the ations
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',  //adding a digit
  CHOOSE_OPERATION: 'choose-operation',  // +-*/
  CLEAR: 'clear',  //AC operation
  DELETE_Digit: 'delete-digit',  //del
  EVALUATE: 'evaluate' // =
}

//instead of action we ill write{type, payload}
function reducer(state, { type, payload }) {     //type because we have many actions so 
  switch (type) {
    //WRITING SOMETHING
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === '0' && state.currentOperand === '0') return state;
      if (payload.digit === '.' && state.currentOperand === '.') return state;

      return {
        ...state,   //spreading
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

    //+, -, *, /
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      //making current operand previous and set operation
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation, //what operation we are passing
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    //AC
    case ACTIONS.CLEAR: //returning empty string on click of AC.
      return {};

    //DEL
    case ACTIONS.DELETE_Digit:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }

      }

      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1) //will remove last digit from current operand
      }

    // =
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }


  }
}

// performs arithmetic operations based on the type of operation passed (+, -, *, /)
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }
  return computation.toString()

}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

//Formats the operands for better display in the calculator, especially handling decimals and integers.
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

  //instead of "state" we write this currentOperand, previousOperand, operation.
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  // dispatch({type: ACTIONS.ADD_DIGIT, payload:{digit:1}})
  return (
    <>
      <h1>CALCULATOR</h1>
      <div className='claculator-grid'>
        <div className='output'>
          <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
          <div className='current-operand'>{formatOperand(currentOperand)}</div>
        </div>
        {/* we dont need to pass payload for clearing as we dont have it for it */}
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}> AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_Digit })}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className='span-two'
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>

    </>
  );
}

export default App;

// Pre-computed high quality diagnostic responses for demo examples and fallback when GEMINI_API_KEY is not set
function getDemoFallbackResult(language, error, code) {
  const errLower = (error || '').toLowerCase()
  const codeLower = (code || '').toLowerCase()

  // 1. Python IndexError
  if (language === 'Python' && (errLower.includes('indexerror') || codeLower.includes('get_last_item') || codeLower.includes('len(items)'))) {
    return {
      rootCause: 'The list index is out of range because the code attempts to access index equal to len(items), which is one position beyond the last valid index.',
      explanation: 'In Python, list indices start at 0 and go up to len(list) - 1. Accessing index len(items) attempts to read an element beyond the end of the list.',
      suggestedFix: 'Change items[len(items)] to items[-1] to access the last element idiomatically in Python, or items[len(items) - 1].',
      fixedCode: `def get_last_item(items):
    return items[-1]

numbers = [10, 20, 30]
print(get_last_item(numbers))`,
    }
  }

  // 2. Python NameError
  if (language === 'Python' && (errLower.includes('nameerror') || codeLower.includes('totla') || errLower.includes('total'))) {
    return {
      rootCause: "Variable 'totla' is referenced before assignment and contains a typo for 'total'.",
      explanation: "Python encountered 'totla += n', but 'totla' has never been defined or initialized in this scope. In addition, the intended variable was likely 'total'.",
      suggestedFix: "Initialize 'total = 0' before the loop, and correct the spelling of 'totla' to 'total'.",
      fixedCode: `def calculate_sum(numbers):
    total = 0
    for n in numbers:
        total += n
    return total

print(calculate_sum([1, 2, 3]))`,
    }
  }

  // 2b. Python Infinite Loop
  if (language === 'Python' && (errLower.includes('timeout') || codeLower.includes('countdown') || errLower.includes('infinite loop'))) {
    return {
      rootCause: "The loop variable 'count' is never decremented inside the while loop, causing an infinite loop condition.",
      explanation: "The condition 'while count > 0' remains true indefinitely because the body of the loop appends 'count' to results without modifying 'count'. Execution will never reach the return statement.",
      suggestedFix: "Add 'count -= 1' inside the while loop body so that the loop progresses toward termination.",
      fixedCode: `def countdown(start):
    count = start
    results = []
    while count > 0:
        results.append(count)
        count -= 1
    return results

print(countdown(5))`,
    }
  }

  // 2c. Python Missing Import
  if (language === 'Python' && (errLower.includes('sqrt') || codeLower.includes('calc_hypotenuse') || codeLower.includes('sqrt('))) {
    return {
      rootCause: "The function 'sqrt' is called in calc_hypotenuse without importing it from the Python 'math' module.",
      explanation: "Python does not provide 'sqrt' in the built-in global namespace. To use mathematical functions like square root, you must explicitly import them from the standard library 'math' module.",
      suggestedFix: "Add 'from math import sqrt' at the top of the file before calling sqrt().",
      fixedCode: `from math import sqrt

def calc_hypotenuse(a, b):
    # Calculate hypotenuse using Pythagorean theorem
    return sqrt(a**2 + b**2)

print(calc_hypotenuse(3, 4))`,
    }
  }

  // 3. JavaScript TypeError (find undefined)
  if (language === 'JavaScript' && (codeLower.includes('users.find') || (errLower.includes('typeerror') && errLower.includes('name')))) {
    return {
      rootCause: "Array.prototype.find() returned undefined because no user matched id 5, and the code attempted to access property '.name' on undefined.",
      explanation: "When find() does not find a matching element in the array, it returns undefined. In JavaScript, reading a property on undefined immediately throws a TypeError.",
      suggestedFix: "Check if the user exists before accessing '.name', or use optional chaining (user?.name) with a default value.",
      fixedCode: `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

function getUserName(id) {
  const user = users.find(u => u.id === id);
  return user ? user.name : 'User not found';
}

console.log(getUserName(5));`,
    }
  }

  // 4. JavaScript TypeError (undefined array value)
  if (language === 'JavaScript' && (codeLower.includes('printfruit') || (errLower.includes('touppercase') || codeLower.includes('fruits')))) {
    return {
      rootCause: "fruits[5] is undefined because the array only contains 3 elements (indices 0 to 2), causing fruits[index].toUpperCase() to fail.",
      explanation: "Accessing an index outside an array's bounds in JavaScript does not throw an IndexError; instead, it returns undefined. Invoking methods like .toUpperCase() on undefined throws a TypeError.",
      suggestedFix: "Validate that index is within range (index >= 0 && index < fruits.length) before calling methods on the element.",
      fixedCode: `const fruits = ['apple', 'banana', 'cherry'];

function printFruit(index) {
  if (index >= 0 && index < fruits.length) {
    console.log(fruits[index].toUpperCase());
  } else {
    console.log('Index out of bounds');
  }
}

printFruit(5);`,
    }
  }

  // 5. C++ Out of Bounds
  if (language === 'C++' && (codeLower.includes('arr[5]') || codeLower.includes('i <= 5') || errLower.includes('segmentation fault'))) {
    return {
      rootCause: "The loop condition 'i <= 5' executes 6 iterations (0 to 5), accessing arr[5] which is beyond the bounds of the 5-element array.",
      explanation: "In C++, an array of size 5 has valid indices 0, 1, 2, 3, and 4. Accessing arr[5] is an out-of-bounds memory access causing undefined behavior or a segmentation fault.",
      suggestedFix: "Change the loop condition from 'i <= 5' to 'i < 5'.",
      fixedCode: `#include <iostream>
using namespace std;

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    for (int i = 0; i < 5; i++) {
        cout << arr[i] << endl;
    }
    return 0;
}`,
    }
  }

  // 6. C++ Uninitialized Variable
  if (language === 'C++' && (codeLower.includes('int sum;') || errLower.includes('garbage') || codeLower.includes('sum += numbers'))) {
    return {
      rootCause: "The local variable 'sum' is declared without an initial value, so it starts with an indeterminate garbage memory value.",
      explanation: "In C++, automatic local variables are not zero-initialized by default. The loop adds array elements to an arbitrary existing memory value, producing incorrect results.",
      suggestedFix: "Initialize the variable to 0 when declaring it: 'int sum = 0;'",
      fixedCode: `#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    int numbers[] = {10, 20, 30, 40, 50};
    int n = 5;
    for (int i = 0; i < n; i++) {
        sum += numbers[i];
    }
    cout << "Sum: " << sum << endl;
    return 0;
}`,
    }
  }

  // Generic fallback for any other input when API key is missing
  return {
    rootCause: 'Offline Demo Mode: GEMINI_API_KEY is not configured.',
    explanation: `BugPilot received your ${language} code and error request. The backend is currently in demo mode because GEMINI_API_KEY is not set in backend/.env.`,
    suggestedFix: 'To enable live Gemini AI diagnosis on custom code, add your Gemini API key to backend/.env (GEMINI_API_KEY=your_key) and restart the backend. Or select one of the 6 built-in examples from the dropdown to test full diagnosis!',
    fixedCode: `// [Demo Mode] Add GEMINI_API_KEY in backend/.env for live AI generation.\n// Your original code:\n${code}`,
  }
}

module.exports = { getDemoFallbackResult }

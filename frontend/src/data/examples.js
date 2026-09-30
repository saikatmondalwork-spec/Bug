// Built-in example bugs for BugPilot AI demonstrations
export const EXAMPLES = [
  {
    id: 'py-index-error',
    title: 'Array Index Error',
    subtitle: 'IndexError: list index out of range',
    language: 'Python',
    error: 'IndexError: list index out of range\n  File "solution.py", line 2, in get_last_item\n    return items[len(items)]',
    code: `def get_last_item(items):
    # Retrieve the final element from the list
    return items[len(items)]

numbers = [10, 20, 30]
print(get_last_item(numbers))`,
    summary: 'Off-by-one error: list indices go from 0 to len-1.',
    category: 'Index Error',
  },
  {
    id: 'py-name-error',
    title: 'Variable Typo / Syntax',
    subtitle: "NameError: name 'totla' is not defined",
    language: 'Python',
    error: "NameError: name 'totla' is not defined\n  File \"calc.py\", line 3, in calculate_sum\n    totla += n",
    code: `def calculate_sum(numbers):
    for n in numbers:
        totla += n
    return totla

print(calculate_sum([1, 2, 3]))`,
    summary: 'Typo in variable name — "totla" is never initialized before accumulation.',
    category: 'Name Error',
  },
  {
    id: 'py-infinite-loop',
    title: 'Infinite Loop',
    subtitle: 'TimeoutError: Loop condition never terminates',
    language: 'Python',
    error: 'TimeoutError: Execution timed out after 5000ms (potential infinite loop detected)',
    code: `def countdown(start):
    count = start
    results = []
    while count > 0:
        results.append(count)
        # count is never decremented
    return results

print(countdown(5))`,
    summary: 'Loop counter "count" is never decremented, causing an endless execution loop.',
    category: 'Logic Error',
  },
  {
    id: 'py-missing-import',
    title: 'Missing Import',
    subtitle: "NameError: name 'sqrt' is not defined",
    language: 'Python',
    error: "NameError: name 'sqrt' is not defined\n  File \"geometry.py\", line 2, in calc_hypotenuse\n    return sqrt(a**2 + b**2)",
    code: `def calc_hypotenuse(a, b):
    # Calculate hypotenuse using Pythagorean theorem
    return sqrt(a**2 + b**2)

print(calc_hypotenuse(3, 4))`,
    summary: 'Function "sqrt" is called without importing "math" or "from math import sqrt".',
    category: 'Import Error',
  },
  {
    id: 'js-type-error',
    title: 'Null / Undefined Property',
    subtitle: "TypeError: Cannot read properties of undefined (reading 'name')",
    language: 'JavaScript',
    error: "TypeError: Cannot read properties of undefined (reading 'name')\n    at getUserName (user.js:8:15)\n    at Object.<anonymous> (user.js:11:13)",
    code: `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

function getUserName(id) {
  const user = users.find(u => u.id === id);
  return user.name;
}

console.log(getUserName(5));`,
    summary: 'find() returns undefined when no item matches; accessing .name throws TypeError.',
    category: 'Null / Undefined',
  },
  {
    id: 'js-undefined-index',
    title: 'Out of Bounds Access',
    subtitle: "TypeError: Cannot read properties of undefined (reading 'toUpperCase')",
    language: 'JavaScript',
    error: "TypeError: Cannot read properties of undefined (reading 'toUpperCase')\n    at printFruit (index.js:4:23)\n    at index.js:7:1",
    code: `const fruits = ['apple', 'banana', 'cherry'];

function printFruit(index) {
  console.log(fruits[index].toUpperCase());
}

printFruit(5);`,
    summary: 'Array access at out-of-range index yields undefined, crashing the string method.',
    category: 'Type Error',
  },
  {
    id: 'cpp-out-of-bounds',
    title: 'Array Out of Bounds',
    subtitle: 'Segmentation fault (core dumped)',
    language: 'C++',
    error: 'Segmentation fault (core dumped) at 0x00007ffe4892c810\nStack trace: main() line 7',
    code: `#include <iostream>
using namespace std;

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    for (int i = 0; i <= 5; i++) {
        cout << arr[i] << endl;
    }
    return 0;
}`,
    summary: 'Loop condition "i <= 5" attempts to read arr[5], which exceeds the 5-element boundary.',
    category: 'Memory Access',
  },
  {
    id: 'cpp-uninit-var',
    title: 'Uninitialized Variable',
    subtitle: 'Undefined behavior / random memory values',
    language: 'C++',
    error: 'Runtime Warning: Use of uninitialized variable "sum"\nOutput: Sum: -858993460 (garbage output)',
    code: `#include <iostream>
using namespace std;

int main() {
    int sum;
    int numbers[] = {10, 20, 30, 40, 50};
    int n = 5;
    for (int i = 0; i < n; i++) {
        sum += numbers[i];
    }
    cout << "Sum: " << sum << endl;
    return 0;
}`,
    summary: 'Variable "sum" is never initialized to 0, producing indeterminate accumulated results.',
    category: 'Undefined Behavior',
  },
]

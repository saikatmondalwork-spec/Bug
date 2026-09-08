// Built-in example bugs for BugPilot AI demonstrations
export const EXAMPLES = [
  {
    id: 'py-index-error',
    title: 'Python — IndexError',
    language: 'Python',
    error: 'IndexError: list index out of range',
    code: `def get_last_item(items):
    return items[len(items)]

numbers = [10, 20, 30]
print(get_last_item(numbers))`,
    summary: 'Off-by-one: list indices go 0 to len-1, not len.',
  },
  {
    id: 'py-name-error',
    title: 'Python — NameError',
    language: 'Python',
    error: "NameError: name 'total' is not defined",
    code: `def calculate_sum(numbers):
    for n in numbers:
        totla += n
    return totla

print(calculate_sum([1, 2, 3]))`,
    summary: 'Typo in variable name — "totla" instead of "total", and never initialised.',
  },
  {
    id: 'js-type-error',
    title: 'JavaScript — TypeError',
    language: 'JavaScript',
    error: "TypeError: Cannot read properties of undefined (reading 'name')",
    code: `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

function getUserName(id) {
  const user = users.find(u => u.id === id);
  return user.name;
}

console.log(getUserName(5));`,
    summary: 'find() returns undefined when no match; accessing .name on undefined throws.',
  },
  {
    id: 'js-undefined-index',
    title: 'JavaScript — Undefined Array Value',
    language: 'JavaScript',
    error: "TypeError: Cannot read properties of undefined (reading 'toUpperCase')",
    code: `const fruits = ['apple', 'banana', 'cherry'];

function printFruit(index) {
  console.log(fruits[index].toUpperCase());
}

printFruit(5);`,
    summary: 'Accessing an out-of-range array index returns undefined, crashing the method call.',
  },
  {
    id: 'cpp-out-of-bounds',
    title: 'C++ — Array Out of Bounds',
    language: 'C++',
    error: 'Segmentation fault (core dumped)',
    code: `#include <iostream>
using namespace std;

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    for (int i = 0; i <= 5; i++) {
        cout << arr[i] << endl;
    }
    return 0;
}`,
    summary: 'Loop condition i <= 5 accesses arr[5] which is out of bounds for a 5-element array.',
  },
  {
    id: 'cpp-uninit-var',
    title: 'C++ — Uninitialized Variable',
    language: 'C++',
    error: 'Undefined behavior / garbage output',
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
    summary: 'Variable "sum" is never initialised to 0 so it accumulates from a garbage value.',
  },
]

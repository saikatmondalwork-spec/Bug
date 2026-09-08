// Mock result used when the real backend is unavailable (dev/UI testing only)
export const MOCK_RESULT = {
  rootCause: 'The list index is out of range because the code attempts to access index equal to the length of the list, which is one position beyond the last valid index.',
  explanation: 'In Python, list indices start at 0 and go up to len(list) - 1. Using len(items) as the index means you are trying to read the element after the last one, which does not exist.',
  suggestedFix: 'Change items[len(items)] to items[len(items) - 1] to access the last element, or more idiomatically use items[-1].',
  fixedCode: `def get_last_item(items):
    return items[-1]

numbers = [10, 20, 30]
print(get_last_item(numbers))  # 30`,
}

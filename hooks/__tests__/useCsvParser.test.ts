import { renderHook, act } from "@testing-library/react";
import { useCsvParser } from "../useCsvParser";
import Papa from "papaparse";

// Mock papaparse
jest.mock("papaparse", () => ({
  parse: jest.fn(),
}));

const mockPapaParse = Papa.parse as jest.MockedFunction<typeof Papa.parse>;

describe("useCsvParser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial state", () => {
    it("should start with isParsing false and no error", () => {
      const { result } = renderHook(() => useCsvParser());

      expect(result.current.isParsing).toBe(false);
      expect(result.current.parseError).toBeNull();
    });
  });

  describe("Successful parsing", () => {
    it("should parse CSV file successfully", async () => {
      const mockRows = [
        { firstName: "John", lastName: "Doe", email: "john@example.com" },
        { firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
      ];

      let completeCallback: ((results: Papa.ParseResult<Record<string, string>>) => void) | undefined;
      mockPapaParse.mockImplementation((file, config) => {
        // Capture callback immediately
        if (config?.complete) {
          completeCallback = config.complete as (results: Papa.ParseResult<Record<string, string>>) => void;
        }
        // Delay callback to allow checking isParsing state
        setTimeout(() => {
          if (completeCallback) {
            completeCallback({
              data: mockRows,
              errors: [],
              meta: {} as Papa.ParseMeta,
            } as Papa.ParseResult<Record<string, string>>);
          }
        }, 10);
        return {} as Papa.ParseWorker;
      });

      const { result } = renderHook(() => useCsvParser());

      const mockFile = new File(["content"], "test.csv", { type: "text/csv" });

      const parsePromise = result.current.parseCsv(mockFile);

      // isParsing is set synchronously, but React state updates are batched
      // Check it's true after React processes the update
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 5));
      });
      expect(result.current.isParsing).toBe(true);
      expect(result.current.parseError).toBeNull();

      const parsedRows = await parsePromise;

      expect(parsedRows).toEqual(mockRows);
      
      // Wait for React to process the state update from the complete callback
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      expect(result.current.isParsing).toBe(false);
      expect(result.current.parseError).toBeNull();
      expect(mockPapaParse).toHaveBeenCalledWith(mockFile, expect.objectContaining({
        header: true,
        skipEmptyLines: true,
      }));
    });

    it("should handle empty CSV files", async () => {
      let completeCallback: ((results: Papa.ParseResult<Record<string, string>>) => void) | undefined;
      mockPapaParse.mockImplementation((file, config) => {
        if (config?.complete) {
          completeCallback = config.complete as (results: Papa.ParseResult<Record<string, string>>) => void;
        }
        return {} as Papa.ParseWorker;
      });

      const { result } = renderHook(() => useCsvParser());

      const mockFile = new File(["content"], "test.csv", { type: "text/csv" });

      const parsePromise = result.current.parseCsv(mockFile);

      act(() => {
        if (completeCallback) {
          completeCallback({
            data: [],
            errors: [],
            meta: {} as Papa.ParseMeta,
          } as Papa.ParseResult<Record<string, string>>);
        }
      });

      const parsedRows = await parsePromise;

      expect(parsedRows).toEqual([]);
      expect(result.current.isParsing).toBe(false);
    });
  });

  describe("Error handling", () => {
    it("should handle parsing errors", async () => {
      const parseError = new Error("Invalid CSV format");
      let errorCallback: ((error: Error) => void) | undefined;
      mockPapaParse.mockImplementation((file, config) => {
        if (config?.error) {
          errorCallback = config.error as (error: Error) => void;
        }
        // Delay error callback to allow checking isParsing state
        setTimeout(() => {
          if (errorCallback) {
            errorCallback(parseError);
          }
        }, 10);
        return {} as Papa.ParseWorker;
      });

      const { result } = renderHook(() => useCsvParser());

      const mockFile = new File(["content"], "test.csv", { type: "text/csv" });

      const parsePromise = result.current.parseCsv(mockFile);

      // isParsing is set synchronously, but React state updates are batched
      // Check it's true after React processes the update
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 5));
      });
      expect(result.current.isParsing).toBe(true);

      await expect(parsePromise).rejects.toThrow("Error parsing CSV: Invalid CSV format");

      // Wait for state updates
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(result.current.isParsing).toBe(false);
      expect(result.current.parseError).toBe("Error parsing CSV: Invalid CSV format");
    });

    it("should reset error state on new parse attempt", async () => {
      let completeCallback: ((results: Papa.ParseResult<Record<string, string>>) => void) | undefined;
      let errorCallback: ((error: Error) => void) | undefined;
      let callCount = 0;

      mockPapaParse.mockImplementation((file, config) => {
        callCount++;
        if (callCount === 1) {
          // First call - error
          if (config?.error) {
            errorCallback = config.error as (error: Error) => void;
            setTimeout(() => {
              if (errorCallback) {
                errorCallback(new Error("First error"));
              }
            }, 0);
          }
        } else {
          // Second call - success
          if (config?.complete) {
            completeCallback = config.complete as (results: Papa.ParseResult<Record<string, string>>) => void;
            setTimeout(() => {
              if (completeCallback) {
                completeCallback({
                  data: [{ name: "Test" }],
                  errors: [],
                  meta: {} as Papa.ParseMeta,
                } as Papa.ParseResult<Record<string, string>>);
              }
            }, 0);
          }
        }
        return {} as Papa.ParseWorker;
      });

      const { result } = renderHook(() => useCsvParser());

      const mockFile = new File(["content"], "test.csv", { type: "text/csv" });

      // First parse - error
      const firstParse = result.current.parseCsv(mockFile);
      await expect(firstParse).rejects.toThrow();
      
      // Wait for error state to be set
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(result.current.parseError).toBeTruthy();

      // Second parse - success (error should be reset when parseCsv is called)
      const secondParse = result.current.parseCsv(mockFile);
      
      // Error is reset synchronously in parseCsv (setParseError(null) is called before Papa.parse)
      // But React state updates might be batched, so wait a tick
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      expect(result.current.parseError).toBeNull();

      await secondParse;
      // After successful parse, error should still be null
      expect(result.current.parseError).toBeNull();
    });
  });
});


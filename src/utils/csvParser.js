import Papa from 'papaparse';

// Expected CSV columns (case-insensitive, whitespace-trimmed)
const EXPECTED_COLUMNS = [
  'Activity Date',
  'Team Name',
  'Activity Topic',
  'Activity Type',
  'Location',
  'Co ordinator',
  'New Contact Names',
  'Lokayat Activist',
  'Sumup'
];

/**
 * Normalize column header: trim whitespace and lowercase for comparison
 */
function normalizeHeader(header) {
  return header.trim().toLowerCase();
}

/**
 * Create a mapping from normalized headers to actual CSV headers
 */
function createHeaderMapping(csvHeaders) {
  const mapping = {};
  const normalizedExpected = EXPECTED_COLUMNS.map(h => normalizeHeader(h));

  csvHeaders.forEach(csvHeader => {
    const normalized = normalizeHeader(csvHeader);
    const expectedIndex = normalizedExpected.indexOf(normalized);
    if (expectedIndex !== -1) {
      mapping[EXPECTED_COLUMNS[expectedIndex]] = csvHeader;
    }
  });

  return mapping;
}

/**
 * Validate that all expected columns are present
 */
function validateColumns(csvHeaders) {
  const headerMapping = createHeaderMapping(csvHeaders);
  const missingColumns = EXPECTED_COLUMNS.filter(col => !headerMapping[col]);

  if (missingColumns.length > 0) {
    return {
      valid: false,
      missingColumns,
      headerMapping: null
    };
  }

  return {
    valid: true,
    missingColumns: [],
    headerMapping
  };
}

/**
 * Remove duplicate rows (where all column values are identical)
 */
function deduplicateRows(rows, headerMapping) {
  const seen = new Set();
  return rows.filter(row => {
    const key = EXPECTED_COLUMNS.map(col => {
      const csvCol = headerMapping[col];
      return String(row[csvCol] || '').trim();
    }).join('|');

    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Normalize row data to use standard column names
 */
function normalizeRow(row, headerMapping) {
  const normalized = {};
  EXPECTED_COLUMNS.forEach(col => {
    const csvCol = headerMapping[col];
    normalized[col] = row[csvCol] || '';
  });
  return normalized;
}

/**
 * Parse and extract unique participants from "New Contact Names" column
 * Names are comma-separated, case-insensitive deduplication
 */
function extractParticipants(rows) {
  const participantMap = new Map(); // lowercase name -> original name
  const participantActivity = new Map(); // lowercase name -> activity type counts

  rows.forEach(row => {
    const namesCell = row['New Contact Names'] || '';
    const activityType = row['Activity Type'] || '';

    if (!namesCell.trim()) return;

    const names = namesCell.split(',').map(n => n.trim()).filter(n => n);

    names.forEach(name => {
      const lowerName = name.toLowerCase();

      // Store original name (first occurrence)
      if (!participantMap.has(lowerName)) {
        participantMap.set(lowerName, name);
        participantActivity.set(lowerName, { total: 0, activities: {} });
      }

      // Increment attendance
      const stats = participantActivity.get(lowerName);
      stats.total += 1;
      stats.activities[activityType] = (stats.activities[activityType] || 0) + 1;
    });
  });

  // Convert to array and sort by total attendance descending
  const participants = Array.from(participantMap.entries()).map(([lowerName, originalName]) => {
    const stats = participantActivity.get(lowerName);
    return {
      name: originalName,
      totalAttendance: stats.total,
      activities: stats.activities
    };
  });

  participants.sort((a, b) => {
    if (b.totalAttendance !== a.totalAttendance) {
      return b.totalAttendance - a.totalAttendance;
    }
    return a.name.localeCompare(b.name);
  });

  return participants;
}

/**
 * Generate activity summary (grouped by Activity Type)
 */
function generateActivitySummary(rows) {
  const activityCounts = {};

  rows.forEach(row => {
    const activityType = row['Activity Type'] || 'Unknown';
    activityCounts[activityType] = (activityCounts[activityType] || 0) + 1;
  });

  // Convert to array and sort by count descending, then alphabetically
  const summary = Object.entries(activityCounts).map(([type, count]) => ({
    activityType: type,
    count
  }));

  summary.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.activityType.localeCompare(b.activityType);
  });

  return summary;
}

/**
 * Generate slides from parsed CSV data
 */
function generateSlides(rows, activitySummary, participants) {
  const slides = [];

  // Slide 1: Activity Summary
  slides.push({
    type: 'summary',
    title: 'Activity Summary',
    data: activitySummary,
    total: rows.length
  });

  // Slide 2: Participants & Attendance
  slides.push({
    type: 'participants',
    title: 'Participants & Attendance',
    data: participants
  });

  // Slides 3-N: One slide per activity type (ordered by count)
  activitySummary.forEach(({ activityType, count }) => {
    const activityRows = rows.filter(row => row['Activity Type'] === activityType);
    slides.push({
      type: 'activity',
      title: `${activityType} — ${count} Activities`,
      activityType,
      count,
      data: activityRows
    });
  });

  return slides;
}

/**
 * Main CSV parsing function
 */
export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        try {
          // Check if we have any data
          if (!results.data || results.data.length === 0) {
            reject(new Error('No data rows found in this file.'));
            return;
          }

          // Validate columns
          const csvHeaders = results.meta.fields || [];
          const validation = validateColumns(csvHeaders);

          if (!validation.valid) {
            const missingCols = validation.missingColumns.map(c => `'${c}'`).join(', ');
            reject(new Error(`Missing required columns: ${missingCols}`));
            return;
          }

          // Deduplicate rows
          let rows = deduplicateRows(results.data, validation.headerMapping);

          // Normalize row data
          rows = rows.map(row => normalizeRow(row, validation.headerMapping));

          if (rows.length === 0) {
            reject(new Error('No data rows found after removing duplicates.'));
            return;
          }

          // Generate slides
          const activitySummary = generateActivitySummary(rows);
          const participants = extractParticipants(rows);
          const slides = generateSlides(rows, activitySummary, participants);

          resolve({
            rawRows: rows,
            slides,
            rowCount: rows.length,
            deduplicatedFrom: results.data.length
          });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
}

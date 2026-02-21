# CSV Presentation App

A browser-based application that converts activity CSV files into interactive, navigable presentations with advanced accessibility features.

## Features

### Core Features
- **CSV Upload**: Drag-and-drop or browse to upload CSV files
- **Download Sample Template**: Get a pre-formatted CSV template with examples
- **Automatic Parsing**: Handles Marathi text and Unicode characters correctly
- **Interactive Slides**: Navigate through summary, participants, and activity-specific slides
- **Custom Slides**: Create and insert custom bullet-point slides anywhere in your presentation
- **localStorage Persistence**: Data survives page reloads - continues where you left off
- **Keyboard Shortcuts**: Navigate with arrow keys, fullscreen with 'F'
- **Dark Theme**: Modern, accessible dark UI optimized for presentations
- **Wide Layout**: Slides use 90% of screen width for maximum visibility

### Accessibility Features
- **8 Font Size Levels**: From compact (14px) to maximum accessibility (28px)
- **A+/A- Controls**: Easy font size adjustment during presentation
- **Scrollable Slides**: Each slide scrolls independently with custom scrollbars
- **Sticky Headers**: Slide titles stay visible while scrolling content
- **Detail Modals**: Click any activity row to see complete details in a modal

### Activity Slide Features
- **Optimized Columns**: Focused view showing only essential data in table
- **Row Details**: Click any row to open a modal with all fields including:
  - Lokayat Activist
  - Full Sumup content with proper formatting
  - Team Name
  - All other activity details
- **Responsive Tables**: Horizontal scroll for wide data

## CSV Format

Your CSV must include these exact column headers (case-insensitive, whitespace-trimmed):

```
Activity Date, Team Name, Activity Topic, Activity Type, Location,
Co ordinator, New Contact Names, Lokayat Activist, Sumup
```

### Important Notes

- **New Contact Names**: Comma-separated names that will be parsed individually
- **Duplicate rows**: Automatically removed during processing
- **Marathi text**: Fully supported in all fields
- **Empty cells**: Handled gracefully with fallback values

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm installed

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

### Getting Started

1. **Download Template** (Optional): Click "Download Sample Template" to get a CSV example
2. **Upload CSV**: Drop or browse to select your CSV file
3. **Validation**: The app checks for required columns and shows errors if any are missing
4. **Generate**: Click "Generate Presentation" to process the file

### During Presentation

1. **Navigate Slides**:
   - Use ← → arrow keys or on-screen buttons
   - Current slide position is saved automatically

2. **Adjust Font Size**:
   - Click **A-** to decrease (8 levels available)
   - Click **A+** to increase
   - Perfect for older viewers or different screen sizes

3. **Add Custom Slides**:
   - Click **"Add Slide"** button in control bar
   - Enter title and content (one bullet point per line)
   - Slide is inserted after current position
   - Automatically saved to browser

4. **View Activity Details**:
   - Click any row in activity slides
   - Modal opens with complete information
   - Click outside or × to close

5. **Fullscreen Mode**:
   - Press 'F' or click fullscreen button
   - Press 'Escape' to exit

6. **Page Reload**:
   - Don't worry! Your presentation state is saved
   - Returns to exact slide and font size
   - Custom slides are preserved

7. **Restart**:
   - Click "Restart" to clear everything
   - Confirmation dialog prevents accidents
   - Returns to upload screen

## Slide Structure

### Generated Slides (from CSV)

1. **Activity Summary**:
   - Table showing count of each activity type
   - Sorted by count (descending)
   - Total row at bottom

2. **Participants & Attendance**:
   - Lists all unique participants from "New Contact Names"
   - Total attendance count per participant
   - Activity breakdown (e.g., "Cultural Practice: 3, Campaign: 1")
   - Sorted by attendance (descending)

3. **Activity Slides** (one per activity type):
   - Table with key columns: Date, Topic, Location, Co ordinator, Contact Names
   - Click any row to see full details including Lokayat Activist and Sumup
   - Modal shows all information in organized format

### Custom Slides (user-created)

4. **Custom Slides**:
   - Created using "Add Slide" button
   - Positioned wherever you insert them
   - Title + bulleted content
   - Perfect for summaries, notes, or section breaks

## Control Bar

The control bar at the bottom provides all presentation controls:

| Button | Function |
|--------|----------|
| **← Prev** | Go to previous slide |
| **Slide X of Y** | Shows current position |
| **Next →** | Go to next slide |
| **A-** | Decrease font size (8 levels) |
| **A+** | Increase font size (8 levels) |
| **Add Slide** | Create custom slide after current position |
| **⛶ Fullscreen** | Toggle fullscreen mode |
| **↺ Restart** | Clear all data and return to upload |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Previous slide |
| `→` | Next slide |
| `F` | Toggle fullscreen |
| `Escape` | Exit fullscreen |

## Font Size Levels

8 accessibility levels to accommodate all viewers:

| Level | Body | Title | Table | Best For |
|-------|------|-------|-------|----------|
| 1 | 14px | 24px | 12px | Maximum data density |
| 2 | 16px | 28px | 14px | Compact view |
| 3 | 18px | 32px | 16px | Standard |
| **4** | **20px** | **36px** | **18px** | **Default - Recommended** |
| 5 | 22px | 40px | 20px | Large text |
| 6 | 24px | 44px | 22px | Very large |
| 7 | 26px | 48px | 24px | Extra large |
| 8 | 28px | 52px | 26px | Maximum accessibility |

## Technical Stack

- **React 18.3**: UI framework
- **Vite 6**: Build tool and dev server
- **PapaParse**: CSV parsing library
- **Pure CSS**: No UI framework dependencies

## Data Storage & Privacy

### localStorage Usage

The app uses browser localStorage to persist your work:

- `csv-presentation-data` - Main presentation slides from CSV
- `csv-presentation-slide-index` - Current slide position
- `csv-presentation-font-size` - Font size preference (size-1 to size-8)
- `csv-presentation-custom-slides` - User-created custom slides

### Privacy

- All processing happens **client-side** in your browser
- No data is uploaded to any server
- No analytics or tracking
- localStorage data stays on your device
- Click "Restart" to clear all stored data
- Clearing browser data also removes all presentation data

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires localStorage support for data persistence.

## Tips for Best Experience

1. **For Older Viewers**: Use font size levels 6-8 (A+ button multiple times)
2. **For Projectors**: Start in fullscreen mode (F key) with size 5-6
3. **Custom Slides**: Add summary slides between sections for better flow
4. **Activity Details**: Click rows instead of trying to read long Sumup text in table
5. **Data Safety**: Your work is auto-saved - refresh won't lose progress
6. **Screen Space**: App uses 90% width - great for wide monitors and projectors

## Troubleshooting

**Q: I refreshed and lost my presentation**
- A: Check if browser is in private/incognito mode (localStorage doesn't persist there)

**Q: Font is too small for my audience**
- A: Click A+ button repeatedly to reach size 7 or 8

**Q: Custom slide disappeared after refresh**
- A: Check browser localStorage is enabled and not being cleared

**Q: Table columns are cut off**
- A: Click on the row to open detail modal with all information

**Q: How do I start fresh?**
- A: Click "Restart" button - it clears all localStorage data

## License

MIT

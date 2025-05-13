import React, { useState } from 'react';

interface Tile {
  type: string;
  color: string;
  id?: number; // Optional id property
}

interface TileData {
  type: string;
  path: number[];
  id?: number; // Optional id property
}

const tileTypes: Tile[] = [
  { type: 'grass', color: 'lightgreen' },
  { type: 'path', color: 'sandybrown' },
  { type: 'tree', color: 'darkgreen' },
  { type: 'water', color: 'blue' },
  { type: 'wild', color: 'purple' }, // Wild tile as a selector
];

const Constructor = () => {
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [selectedType, setSelectedType] = useState(tileTypes[0].type);
  const [grid, setGrid] = useState<Tile[][]>([]);
  const [selectedPosition, setSelectedPosition] = useState<{row: number; col: number} | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedTileMessage, setSelectedTileMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGrid = Array.from({ length: rows }, () => Array(cols).fill({ type: 'grass', color: 'lightgreen' }));
    setGrid(newGrid);
  };

  const handleTileClick = (row: number, col: number) => {
    const newGrid = [...grid];
    const clickedTile = newGrid[row][col];

    if (selectedType === 'wild') {
      if (clickedTile.type === 'path') {
        setSelectedPosition({row, col});
        setInputValue(clickedTile.id?.toString() || '');
        setSelectedTileMessage(`Selected Path Tile at position [${row},${col}]`);
      }
      return;
    }

    const selectedTile = tileTypes.find(t => t.type === selectedType);
    const tileData: Tile = { 
      type: selectedType, 
      color: selectedTile ? selectedTile.color : 'lightgreen'
    };

    if (selectedType === 'path') {
      tileData.id = newGrid.flat().filter(tile => tile.type === 'path').length + 1;
    }

    newGrid[row][col] = tileData;    
    setGrid(newGrid);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (selectedPosition && value !== '') {
      const newGrid = [...grid];
      const { row, col } = selectedPosition;
      newGrid[row][col] = {
        ...newGrid[row][col],
        id: value ? Number(value) : undefined
      };
      setGrid(newGrid);
    }
  };

  const generateJSON = () => {
    const jsonOutput = {
      width: cols,
      height: rows,
      defaultTile: 'grass',
      tiles: [] as TileData[],
    };

    let pathIdCounter = 1;

    grid.forEach((row, rowIndex) => {
      row.forEach((tile: Tile, colIndex) => {
        if (tile.type !== 'grass') {
          const tileData: TileData = {
            type: tile.type,
            path: [colIndex, rowIndex],
          };

          if (tile.type === 'path') {
            tileData.id = pathIdCounter;
            pathIdCounter++;
          }

          jsonOutput.tiles.push(tileData);
        }
      });
    });

    const jsonString = JSON.stringify(jsonOutput, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grid.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="number" value={rows} onChange={(e) => setRows(Number(e.target.value))} placeholder="Rows" required />
        <input type="number" value={cols} onChange={(e) => setCols(Number(e.target.value))} placeholder="Columns" required />
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          {tileTypes.map((tile) => (
            <option key={tile.type} value={tile.type}>{tile.type}</option>
          ))}
        </select>
        <button type="submit">Create Grid</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 50px)`, marginTop: '20px' }}>
        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleTileClick(rowIndex, colIndex)}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: tile.color,
                border: '1px solid black',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'black',
              }}
            >
              {tile.type === 'path' && tile.id ? tile.id : ''}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="idInput">Change ID: </label>
        <input 
          id="idInput"
          type="number" 
          value={inputValue}
          onChange={handleIdChange} 
          placeholder="Change ID" 
          disabled={selectedType !== 'wild'}
        />
      </div>

      <div style={{ marginTop: '10px', color: 'blue' }}>
        {selectedTileMessage}
      </div>

      <button onClick={generateJSON}>Generate JSON</button>
    </div>
  );
};

export default Constructor;

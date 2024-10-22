/* eslint-disable react/no-array-index-key */

'use client';

import React, { useState } from 'react';
import Test from '../components/Test';
import team from '../utils/sample-data/team.json';

// Fisher-Yates Shuffle to randomize the array
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// Function to dynamically group team members and ensure separation
function groupTeamMembers(shuffledTeam, name1, name2) {
  const groups = { 1: [], 2: [], 3: [] };
  let availableGroups = [1, 2, 3]; // Track which groups still have room for members

  shuffledTeam.forEach((member) => {
    // If the member is one of the names to be separated, handle them specifically
    if (member.name === name1 || member.name === name2) {
      const groupWithOther = Object.keys(groups).find((number) => groups[number].some((m) => m.name === (member.name === name1 ? name2 : name1)));

      // If we found a group with the other name, assign this member to a different group
      const targetGroup = availableGroups.filter(
        // eslint-disable-next-line radix
        (group) => group !== parseInt(groupWithOther),
      )[0];

      if (targetGroup !== undefined) {
        // Ensure targetGroup is defined
        // Check if the group with the other name exists and has members
        if (groupWithOther !== undefined && groups[groupWithOther].length === 2) {
          // Swap with a member from the group that contains the other name
          const memberToSwap = groups[groupWithOther].pop(); // Remove a member from the group
          groups[targetGroup].push(member); // Add the current member
          groups[groupWithOther].push(memberToSwap); // Move the swapped member to the target group
        } else {
          groups[targetGroup].push(member); // Just add the member if the other group is not full
        }

        // Remove group from available groups if it's full
        if (groups[targetGroup].length === 2) {
          availableGroups = availableGroups.filter((group) => group !== targetGroup);
        }
      }
    } else {
      // For all other members, place them into available groups with space
      const targetGroup = availableGroups[0];

      if (targetGroup !== undefined) {
        // Ensure targetGroup is defined
        groups[targetGroup].push(member);

        // Remove group from available groups if it's full
        if (groups[targetGroup].length === 2) {
          availableGroups = availableGroups.filter((group) => group !== targetGroup);
        }
      }
    }
  });

  return groups;
}

function Home() {
  const [groupedTeam, setGroupedTeam] = useState(groupTeamMembers(shuffleArray(team), 'Brittany', 'Tommy'));

  const handleShuffle = () => {
    const shuffledTeam = shuffleArray(team); // Shuffle the team array
    const newGroupedTeam = groupTeamMembers(shuffledTeam, 'Kayla', 'Tommy'); // Group again
    setGroupedTeam(newGroupedTeam); // Update the state with new groups
  };

  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-content-center"
      style={{
        height: '90vh',
        padding: '30px',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <button type="button" onClick={handleShuffle} style={{ marginBottom: '20px' }}>
        Shuffle Team
      </button>
      {Object.keys(groupedTeam).map((number) => (
        <div key={number}>
          <hr />
          <h2>DC {number}</h2>
          <hr />
          {groupedTeam[number].map((member, idx) => (
            <div key={idx}>
              <Test taco={member.name} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Home;

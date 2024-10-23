import { createClient } from '@sanity/client'
import { useState, useEffect } from 'react';

import SleighSvg from './assets/sleigh.svg'
import ReindeerSvg from './assets/reindeer.svg'

import './TeamBuilder.css'

const TeamBuilder = () => {
  const [reindeerList, setReindeerList] = useState([])
  const [sleighList, setSleighList] = useState([])

  const sanityClient = createClient({
    projectId: import.meta.env.VITE_SANITY_STUDIO_PROJECT_ID,
    dataset: import.meta.env.VITE_SANITY_STUDIO_DATASET,
    useCdn: false,
    apiVersion: '2024-10-23',
  })

  const getReindeerQuery = '*[_type == "reindeer"]'
  const getSleighsQuery = '*[_type == "sleigh"]'

  useEffect(() => {
    const getReindeer = async () => {
      const reindeer = await sanityClient.fetch(getReindeerQuery)
      setReindeerList(reindeer)
    }

    const getSleighs = async () => {
      const sleighs = await sanityClient.fetch(getSleighsQuery)
      setSleighList(sleighs)
      // setSelectedSleigh(sleighs[0])
    }

    getReindeer()
    getSleighs()

  }, [])

  console.log('reindeerList', reindeerList)
  console.log('sleighList', sleighList)

  const [selectedSleigh, setSelectedSleigh] = useState(null)

  const handleSleighChange = (sleigh) => {
    console.log('sleigh changed!', sleigh)
    setSelectedSleigh(sleigh)
  }

  return (
    <>
      <p>Let's build a reindeer team!</p>
      <SleighSelect sleighs={sleighList} handleSleighChange={handleSleighChange} />
      {
        selectedSleigh?.teamSize > 0 &&
        Array.from({ length: selectedSleigh.teamSize }).map(index => (
          <ReindeerSelect key={index} reindeer={reindeerList} />
        ))
      }
      <p>{`Team size for selected sleigh: ${selectedSleigh?.teamSize}`}</p>
    </>
  )
}

const SleighSelect = ({ sleighs, handleSleighChange }) => {
  const [selectedValue, setSelectedValue] = useState(null)

  const handleChange = (event) => {
    const index = event.target.value
    setSelectedValue(index)
    handleSleighChange(sleighs[index])
  }

  return (
    <>
      <select
        value={selectedValue}
        onChange={handleChange}
      >
        <option value={null}>Please select a sleigh</option>
        {
          sleighs.map((sleigh, index) => (
            <option key={sleigh._id} value={index}>
              {sleigh.name}
            </option>
          ))
        }
      </select>
      <img src={SleighSvg} alt="" class="sleigh-icon" />
    </>
  )
}

const ReindeerSelect = ({ reindeer }) => {
  return (
    <>
      <select>
        {
          reindeer.map(r => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))
        }
      </select>
      <img src={ReindeerSvg} alt="" class="reindeer-icon" />
    </>
  )
}

export default TeamBuilder;
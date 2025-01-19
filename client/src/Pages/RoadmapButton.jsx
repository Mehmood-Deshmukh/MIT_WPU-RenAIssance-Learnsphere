import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Accordion, AccordionTab } from 'primereact/accordion';

const RoadmapDialog = ({ visible, onHide, topicData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState(null);

  const getSeverity = (importance) => {
    switch (importance) {
      case 'Critical': return 'danger';
      case 'Important': return 'warning';
      case 'Good to know': return 'info';
      default: return 'info';
    }
  };

  const timelineEvents = topicData?.learningPhases?.map((phase, index) => ({
    status: index < activeIndex ? 'Completed' : index === activeIndex ? 'Active' : 'Pending',
    phase: phase.phase,
    duration: phase.duration,
    topics: phase.topics,
    milestones: phase.milestones,
    icon: index < activeIndex ? 'pi pi-check-circle' : index === activeIndex ? 'pi pi-spin pi-cog' : 'pi pi-clock',
    color: index < activeIndex ? '#22C55E' : index === activeIndex ? '#3B82F6' : '#94A3B8'
  }));

  const customizedMarker = (item) => {
    return (
      <span className="flex w-[2vw] h-8 items-center justify-center rounded-full shadow-lg" style={{ backgroundColor: item.color }}>
        <i className={`${item.icon} text-white text-lg`}></i>
      </span>
    );
  };

  const customizedContent = (item) => (
    <Card className="w-full mb-6 shadow-md border-l-4" style={{ borderLeftColor: item.color }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{item.phase}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <i className="pi pi-clock"></i>
            <span>{item.duration}</span>
          </div>
        </div>
        <Tag 
          value={item.status} 
          severity={item.status === 'Completed' ? 'success' : item.status === 'Active' ? 'info' : 'warning'}
        />
      </div>
      
      <Accordion>
        <AccordionTab 
          header={
            <div className="flex justify-between items-center">
              <span>Topics & Resources</span>
              <i className="pi pi-book ml-2"></i>
            </div>
          }
        >
          {item.topics.map((topic, index) => (
            <div key={index} className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">{topic.name}</h4>
              <p className="text-gray-600 mb-3">{topic.description}</p>
              
              <h5 className="font-medium mb-2">Resources:</h5>
              <ul className="list-none p-0 m-0">
                {topic.resources.map((resource, idx) => (
                  <li key={idx} className="flex items-center gap-2 mb-2">
                    <i className="pi pi-link"></i>
                    <span>{resource.title}</span>
                  </li>
                ))}
              </ul>

              <h5 className="font-medium mt-3 mb-2">Practice Projects:</h5>
              {topic.practiceProjects.map((project, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg shadow-sm mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{project.title}</span>
                    <Tag value={project.difficulty} severity={project.difficulty === 'Easy' ? 'success' : project.difficulty === 'Medium' ? 'warning' : 'danger'} />
                  </div>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
              ))}
            </div>
          ))}
        </AccordionTab>
        <AccordionTab 
          header={
            <div className="flex justify-between items-center">
              <span>Milestones</span>
              <i className="pi pi-flag ml-2"></i>
            </div>
          }
        >
          {item.milestones.map((milestone, index) => (
            <div key={index} className="mb-4 p-4 bg-green-50 rounded-lg">
              <p className="font-medium mb-3">{milestone.description}</p>
              <ul className="list-none p-0 m-0">
                {milestone.checkpoints.map((checkpoint, idx) => (
                  <li key={idx} className="flex items-center gap-2 mb-2">
                    <i className="pi pi-check-circle text-green-500"></i>
                    <span>{checkpoint}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </AccordionTab>
      </Accordion>

      {item.status === 'Active' && (
        <div className="mt-4">
          <Button 
            label="Start Learning" 
            icon="pi pi-play"
            className="p-button-outlined p-button-success"
          />
        </div>
      )}
    </Card>
  );

  return (
    <Dialog 
      visible={visible} 
      onHide={onHide}
      header="Your Learning Journey"
      style={{ width: '90vw', maxWidth: '1200px' }}
      className="p-fluid"
    >
      <div className="flex flex-col gap-6">
        <Card className="shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {topicData?.roadmapTitle}
            </h2>
            <div className="flex gap-4">
              <Tag icon="pi pi-clock" value={topicData?.estimatedTime} />
              <Tag icon="pi pi-chart-line" value={topicData?.difficulty} severity="warning" />
            </div>
          </div>
          <ProgressBar 
            value={(activeIndex / (timelineEvents?.length || 1)) * 100}
            className="h-2 mb-4"
          />
          <div className="text-sm text-gray-600">
            Your progress: {Math.round((activeIndex / (timelineEvents?.length || 1)) * 100)}% complete
          </div>
        </Card>

        <Timeline 
          value={timelineEvents} 
          align="alternate" 
          className="customized-timeline"
          marker={customizedMarker}
          content={customizedContent}
        />
      </div>
    </Dialog>
  );
};

// Main export component that will be used in the StudentAssignment
const RoadmapButton = ({ roadmapData }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button 
        label="View Learning Path" 
        icon="pi pi-compass"
        className="p-button-outlined p-button-info"
        onClick={() => setVisible(true)}
      />
      <RoadmapDialog
        visible={visible}
        onHide={() => setVisible(false)}
        topicData={roadmapData}
      />
    </>
  );
};

export default RoadmapButton;
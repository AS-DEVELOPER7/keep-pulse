'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/organisms/common/PageHeader.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { Input } from '@/components/atoms/Input.jsx';
import { Select } from '@/components/atoms/Select.jsx';
import { Card } from '@/components/atoms/Card.jsx';
import { ProjectCard } from '@/components/organisms/projects/ProjectCard.jsx';
import { ProjectModal } from '@/components/organisms/projects/ProjectModal.jsx';
import { ConfirmModal } from '@/components/organisms/common/ConfirmModal.jsx';
import { 
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  usePingProjectNowMutation,
} from '@/store/services/projectsApi';
import {
  openCreateModal,
  openEditModal,
  closeModal,
  setSearchQuery,
  setSelectedStatus
} from '@/store/slices/projectSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks.js';
import { useToast } from '@/hooks/useToast.js';
import { Plus, Search, Layers } from 'lucide-react';

import { PROJECT_STATUS_OPTIONS } from '@/constants';

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { searchQuery, selectedStatus, isCreateModalOpen, editingProject } = useAppSelector(
    (state) => state.projects
  );

  const [projectToDelete, setProjectToDelete] = useState(null);
  const { data: projects = [], isLoading } = useGetProjectsQuery(undefined, {
    pollingInterval: 4000,
  });
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [pingProjectNow, { isLoading: isPinging }] = usePingProjectNowMutation();

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (formData.id) {
        await updateProject(formData).unwrap();
        toast.success(`Project "${formData.name}" updated successfully!`);
      } else {
        await createProject(formData).unwrap();
        toast.success(`Project "${formData.name}" registered successfully!`);
      }
      dispatch(closeModal());
    } catch (err) {
      toast.error(err?.data?.error || err?.message || 'Failed to save project');
    }
  };

  const handlePingNow = async (id) => {
    const proj = projects.find((p) => p.id === id);
    try {
      const res = await pingProjectNow(id).unwrap();
      if (res?.success) {
        toast.success(`Keep-alive ping to "${proj?.name || 'Project'}" succeeded! (${res.result?.statusCode || 200} OK)`);
      } else {
        toast.error(res?.result?.errorMessage || res?.error || `Ping failed for "${proj?.name || 'Project'}"`);
      }
    } catch (err) {
      toast.error(err?.data?.error || err?.message || `Ping failed for "${proj?.name || 'Project'}"`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete.id).unwrap();
        toast.success(`Project "${projectToDelete.name}" deleted successfully.`);
        setProjectToDelete(null);
      } catch (err) {
        toast.error(err?.data?.error || err?.message || 'Failed to delete project');
      }
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.target_url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || project.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Monitored Projects"
        description="Register and manage Supabase & REST API projects to keep them active and unpaused."
        actions={
          <Button icon={Plus} onClick={() => dispatch(openCreateModal())}>
            Add New Project
          </Button>
        }
      />

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="flex-1 w-full">
          <Input
            icon={Search}
            placeholder="Search projects by name or URL..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={PROJECT_STATUS_OPTIONS}
            value={selectedStatus}
            onChange={(e) => dispatch(setSelectedStatus(e.target.value))}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <Card padding="p-8 text-center text-slate-500">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
          <p className="mt-2 text-sm">Loading projects...</p>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card padding="p-12 text-center text-slate-500">
          <Layers className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <h4 className="font-bold text-base text-slate-700 dark:text-slate-300">No Projects Found</h4>
          <p className="mt-1 text-xs text-slate-400">Click &quot;Add New Project&quot; to register your first Supabase database or API.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPingNow={handlePingNow}
              onEdit={(p) => dispatch(openEditModal(p))}
              onDelete={(id) => setProjectToDelete(projects.find((p) => p.id === id))}
              isPinging={isPinging}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => dispatch(closeModal())}
        onSubmit={handleCreateOrUpdate}
        initialData={editingProject}
        isLoading={isCreating || isUpdating}
      />

      {/* Custom Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Monitored Project"
        description={`Are you sure you want to delete "${projectToDelete?.name}"? This action cannot be undone and will stop all automated keep-alive pings.`}
        confirmText="Delete Project"
        isLoading={isDeleting}
      />
    </div>
  );
}

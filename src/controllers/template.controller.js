// controllers/template.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Template } from "../models/template.model.js";
import mongoose from "mongoose";

/**
 * @desc Create a new template
 * @route POST /api/templates
 */
export const createTemplate = asyncHandler(async (req, res) => {
  const { name, content, type = "Page", isPublic = false } = req.body;
  const userId = req.user._id;

  if (!name || !content) {
    throw new ApiError(400, "Name and content are required");
  }

  const template = await Template.create({
    name,
    content,
    type,
    createdBy: userId,
    isPublic,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, template, "Template created successfully"));
});

/**
 * @desc Get all public templates
 * @route GET /api/templates
 */
export const getAllTemplates = asyncHandler(async (req, res) => {
  const templates = await Template.find({ isPublic: true }).sort({
    usageCount: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, templates, "Public templates fetched"));
});

/**
 * @desc Get a single template by ID
 * @route GET /api/templates/:templateId
 */
export const getTemplateById = asyncHandler(async (req, res) => {
  const { templateId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(templateId)) {
    throw new ApiError(400, "Invalid template ID");
  }

  const template = await Template.findById(templateId);
  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  if (
    !template.isPublic &&
    template.createdBy.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You do not have access to this template");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, template, "Template retrieved"));
});

/**
 * @desc Update a template
 * @route PUT /api/templates/:templateId
 */
export const updateTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const userId = req.user._id;
  const { name, content, type, isPublic } = req.body;

  const template = await Template.findById(templateId);
  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  if (!template.createdBy.equals(userId)) {
    throw new ApiError(403, "You are not the owner of this template");
  }

  if (name) template.name = name;
  if (content) template.content = content;
  if (type) template.type = type;
  if (typeof isPublic === "boolean") template.isPublic = isPublic;

  await template.save();

  return res
    .status(200)
    .json(new ApiResponse(200, template, "Template updated successfully"));
});

/**
 * @desc Delete a template
 * @route DELETE /api/templates/:templateId
 */
export const deleteTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const userId = req.user._id;

  const template = await Template.findById(templateId);
  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  if (!template.createdBy.equals(userId)) {
    throw new ApiError(403, "You are not allowed to delete this template");
  }

  await template.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Template deleted successfully"));
});
